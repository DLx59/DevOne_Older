// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function(config) {
  config.set({
    autoWatch: true,
    basePath: "",
    browsers: ["ChromeHeadlessNoSandbox"],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    colors: true,
    coverageIstanbulReporter: {
      dir: require("path").join(__dirname, "./coverage"),
      fixWebpackSourcePaths: true,
      reports: ["html", "lcovonly", "text-summary"],
    },
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: "ChromeHeadless",
        flags: ["--no-sandbox"],
      },
    },
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    logLevel: config.LOG_INFO,
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-jasmine-html-reporter"),
      require("karma-coverage-istanbul-reporter"),
      require("@angular-devkit/build-angular/plugins/karma"),
      require("karma-coverage"),
    ],
    port: 9876,
    preprocessors: {
      "src/app/**/*.spec.ts": ["coverage"],
    },
    reporters: ["progress", "kjhtml", "coverage-istanbul", "coverage"],
    restartOnFileChange: true,
    singleRun: false,
  });
};
