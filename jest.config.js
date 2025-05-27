module.exports = {
    transform: {
      "^.+\\.[jt]sx?$": "babel-jest",
    },
    testEnvironment: "jsdom",
    moduleFileExtensions: ["js", "jsx"],
    transformIgnorePatterns: [
        "/node_modules/(?!axios)/",
    ],
    moduleNameMapper: {
      "\\.(css|less|scss|sass)$": "<rootDir>/__mocks__/styleMock.js",
      "\\.(jpg|jpeg|png|svg)$": "<rootDir>/__mocks__/fileMock.js",
    },
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"]
  };
  