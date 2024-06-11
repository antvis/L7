(window as any).URL.createObjectURL = jest.fn;
(window as any).ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
}));
