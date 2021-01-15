module.exports = {
  "moduleFileExtensions": [
    "ts",
    "js"
  ],
  "transform": {
    "^.+\\.ts$": "ts-jest"
  },
  "testMatch": [
    "**/tests/**/*.test.ts"
  ],
  "moduleNameMapper": {
    "^@/(.+)": "<rootDir>/src/$1"
  }
}