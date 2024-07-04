module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    roots: ['<rootDir>/public/src', '<rootDir>/bff'],
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
    },
  };
  