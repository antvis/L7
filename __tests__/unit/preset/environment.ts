(window as any).URL.createObjectURL = function () {};

(window as any).console = {
  warn: jest.fn,
  log: jest.fn,
  error: jest.fn,
};
