module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  moduleFileExtensions: ['js', 'jsx'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: '.',
      outputName: 'junit.xml',
    }]
  ],
  collectCoverageFrom: [
    'src/js/**/*.js',
    '!src/js/**/*.test.js',
    '!src/js/__tests__/**'
  ]
};
