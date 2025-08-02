module.exports = {
testEnvironment: 'jest-environment-jsdom',
setupFilesAfterEnv: ['./src/setupTests.js'],
// Add transform to tell Jest to use babel-jest for .js, .jsx files
transform: {
'^.+\.(js|jsx)$': 'babel-jest',
},
// Jest might ignore node_modules by default, but sometimes you need to
// explicitly tell it to transform specific modules if they use ESM.
// For this exercise, the default should be fine, but keep this in mind:
// transformIgnorePatterns: ['/node_modules/(?!your-esm-module-here)/'],
};
