/**
 * Browser-side WebAuthn helpers: base64url conversion, ceremony drivers around
 * navigator.credentials, capability checks, and friendly error messages.
 *
 * The JSON shapes produced here match what the Yubico (java-webauthn-server) backend expects from
 * PublicKeyCredential.parseRegistrationResponseJson / parseAssertionResponseJson.
 */

/**
 * Decodes a base64url string into a Uint8Array suitable for use as a BufferSource.
 *
 * @param {string} base64url the base64url-encoded value
 * @returns {Uint8Array} the decoded bytes
 */
export const base64urlToBuffer = base64url => {
  const padding = '='.repeat((4 - (base64url.length % 4)) % 4);
  const base64 = (base64url + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(base64);
  const buffer = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) {
    buffer[i] = raw.charCodeAt(i);
  }
  return buffer;
};

/**
 * Encodes an ArrayBuffer (or ArrayBufferView) as a base64url string without padding.
 *
 * @param {ArrayBuffer|ArrayBufferView} buffer the bytes to encode
 * @returns {string} the base64url-encoded value
 */
export const bufferToBase64url = buffer => {
  let bytes;
  if (buffer instanceof ArrayBuffer) {
    bytes = new Uint8Array(buffer);
  } else if (ArrayBuffer.isView(buffer)) {
    // Respect the view's offset and length so we only encode the intended bytes.
    bytes = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  } else {
    bytes = new Uint8Array(buffer);
  }
  let str = '';
  for (let i = 0; i < bytes.length; i += 1) {
    str += String.fromCharCode(bytes[i]);
  }
  return window.btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

/**
 * Whether this browser supports the WebAuthn API.
 *
 * @returns {boolean} true if WebAuthn is available
 */
export const isWebAuthnSupported = () =>
  typeof window !== 'undefined' &&
  typeof window.PublicKeyCredential !== 'undefined' &&
  !!(navigator.credentials && navigator.credentials.create && navigator.credentials.get);

/**
 * Whether a built-in platform authenticator (Touch ID, Windows Hello, Android biometrics) is
 * available. Resolves false on any error or when unsupported.
 *
 * @returns {Promise<boolean>} resolves to true if a platform authenticator is available
 */
export const isPlatformAuthenticatorAvailable = async () => {
  if (!isWebAuthnSupported() || typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable !== 'function') {
    return false;
  }
  try {
    return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch (err) {
    return false;
  }
};

/**
 * Serialises the result of navigator.credentials.create() into the JSON the backend expects.
 *
 * @param {PublicKeyCredential} credential the created credential
 * @returns {object} the attestation response JSON
 */
const registrationCredentialToJson = credential => {
  const { response } = credential;
  const json = {
    type: credential.type,
    id: credential.id,
    rawId: bufferToBase64url(credential.rawId),
    response: {
      attestationObject: bufferToBase64url(response.attestationObject),
      clientDataJSON: bufferToBase64url(response.clientDataJSON),
    },
    clientExtensionResults: typeof credential.getClientExtensionResults === 'function' ? credential.getClientExtensionResults() : {},
  };
  if (typeof response.getTransports === 'function') {
    const transports = response.getTransports();
    if (transports && transports.length) {
      json.response.transports = transports;
    }
  }
  return json;
};

/**
 * Serialises the result of navigator.credentials.get() into the JSON the backend expects.
 *
 * @param {PublicKeyCredential} credential the asserted credential
 * @returns {object} the assertion response JSON
 */
const assertionCredentialToJson = credential => {
  const { response } = credential;
  const json = {
    type: credential.type,
    id: credential.id,
    rawId: bufferToBase64url(credential.rawId),
    response: {
      authenticatorData: bufferToBase64url(response.authenticatorData),
      clientDataJSON: bufferToBase64url(response.clientDataJSON),
      signature: bufferToBase64url(response.signature),
    },
    clientExtensionResults: typeof credential.getClientExtensionResults === 'function' ? credential.getClientExtensionResults() : {},
  };
  if (response.userHandle) {
    json.response.userHandle = bufferToBase64url(response.userHandle);
  }
  return json;
};

/**
 * Runs a registration ceremony: converts the server options, invokes the authenticator, and returns
 * the attestation response JSON.
 *
 * @param {object} publicKeyOptions the server-issued options (the `publicKey` member)
 * @returns {Promise<object>} the attestation response JSON
 */
export const createRegistrationCredential = async publicKeyOptions => {
  const publicKey = { ...publicKeyOptions };
  publicKey.challenge = base64urlToBuffer(publicKey.challenge);
  publicKey.user = { ...publicKey.user, id: base64urlToBuffer(publicKey.user.id) };
  if (Array.isArray(publicKey.excludeCredentials)) {
    publicKey.excludeCredentials = publicKey.excludeCredentials.map(cred => ({
      ...cred,
      id: base64urlToBuffer(cred.id),
    }));
  }
  const credential = await navigator.credentials.create({ publicKey });
  if (!credential) {
    throw new DOMException('No credential was created', 'NotAllowedError');
  }
  return registrationCredentialToJson(credential);
};

/**
 * Runs an authentication ceremony: converts the server options, invokes the authenticator, and
 * returns the assertion response JSON.
 *
 * @param {object} publicKeyOptions the server-issued options (the `publicKey` member)
 * @returns {Promise<object>} the assertion response JSON
 */
export const getAssertionCredential = async publicKeyOptions => {
  const publicKey = { ...publicKeyOptions };
  publicKey.challenge = base64urlToBuffer(publicKey.challenge);
  if (Array.isArray(publicKey.allowCredentials)) {
    publicKey.allowCredentials = publicKey.allowCredentials.map(cred => ({
      ...cred,
      id: base64urlToBuffer(cred.id),
    }));
  }
  const credential = await navigator.credentials.get({ publicKey });
  if (!credential) {
    throw new DOMException('No credential was returned', 'NotAllowedError');
  }
  return assertionCredentialToJson(credential);
};

/**
 * Translates a WebAuthn / DOM error into a friendly, user-facing message.
 *
 * @param {unknown} error the thrown error
 * @returns {string} a human-readable message
 */
export const describeWebAuthnError = error => {
  if (!error) {
    return 'Something went wrong with your passkey. Please try again.';
  }
  switch (error.name) {
    case 'NotAllowedError':
      return 'The passkey prompt was dismissed or timed out. Please try again.';
    case 'InvalidStateError':
      return 'A passkey for this account already exists on this device.';
    case 'NotSupportedError':
      return 'This device or browser does not support passkeys.';
    case 'SecurityError':
      return 'Passkeys are blocked in this context. Make sure you are on a secure (HTTPS) connection.';
    case 'AbortError':
      return 'The passkey request was cancelled.';
    default:
      return error.message || 'Something went wrong with your passkey. Please try again.';
  }
};

/**
 * Suggests a friendly default passkey name based on the current browser and OS.
 *
 * @returns {string} a suggested label
 */
export const suggestPasskeyName = () => {
  if (typeof navigator === 'undefined') {
    return 'My passkey';
  }
  const ua = navigator.userAgent || '';
  let os = 'this device';
  if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS';
  else if (/Macintosh|Mac OS X/i.test(ua)) os = 'macOS';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/Windows/i.test(ua)) os = 'Windows';
  else if (/Linux/i.test(ua)) os = 'Linux';

  let browser = '';
  if (/Edg\//i.test(ua)) browser = 'Edge';
  else if (/OPR\/|Opera/i.test(ua)) browser = 'Opera';
  else if (/Chrome\//i.test(ua)) browser = 'Chrome';
  else if (/Firefox\//i.test(ua)) browser = 'Firefox';
  else if (/Safari\//i.test(ua)) browser = 'Safari';

  return browser ? `${browser} on ${os}` : `Passkey on ${os}`;
};
