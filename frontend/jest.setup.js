import '@testing-library/jest-dom';

// jest.setup.js

// --- jsdom polyfills ---
// jsdom omits these browser APIs that MUI, animations, and a few components
// reach for; stub them (inert) so component renders don't crash in tests.
if (typeof window !== 'undefined') {
  if (typeof window.matchMedia !== 'function') {
    window.matchMedia = (query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    });
  }
  if (typeof window.scrollTo !== 'function') {
    window.scrollTo = () => {};
  }
  if (typeof window.HTMLElement !== 'undefined') {
    window.HTMLElement.prototype.scrollIntoView = () => {};
    // autoFocus toggles MUI focus classes, and jsdom applies it inconsistently
    // across environments (focuses locally but not on CI), which would make
    // focus-sensitive snapshots flaky. Neutralize focus so the rendered markup
    // is the unfocused state everywhere.
    window.HTMLElement.prototype.focus = () => {};
  }
}

class MockObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
if (typeof global.ResizeObserver === 'undefined') global.ResizeObserver = MockObserver;
if (typeof global.IntersectionObserver === 'undefined')
  global.IntersectionObserver = MockObserver;

// Keep the original console.error
const originalConsoleError = console.error;

// Override console.error to ignore the ReactDOMTestUtils.act deprecation warning
beforeAll(() => {
  console.error = (...args) => {
    const msg = args[0];
    if (typeof msg === 'string' && msg.includes('ReactDOMTestUtils.act')) {
      return;
    }
    originalConsoleError(...args);
  };
});

// (Optionally) do the same for console.warn if you see warnings you’d like to ignore:
/*
const originalConsoleWarn = console.warn;
beforeAll(() => {
  console.warn = (...args) => {
    const msg = args[0];
    if (typeof msg === 'string' && msg.includes('ReactDOMTestUtils.act')) {
      return;
    }
    originalConsoleWarn(...args);
  };
});
*/
