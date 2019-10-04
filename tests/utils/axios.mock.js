const mockAxios = {
  __esModule: true,
  get: jest.fn(() => Promise.resolve({ data: 'data' })),
  default: jest.fn(() => Promise.resolve({ data: 'data' })),
};

export default mockAxios;
