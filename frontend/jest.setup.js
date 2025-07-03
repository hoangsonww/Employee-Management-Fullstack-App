import '@testing-library/jest-dom';

// jest.setup.js

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
