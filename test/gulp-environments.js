var environments = require("../");
var expect = require("chai").expect;
var refresh = function(path) {
  delete require.cache[require.resolve(path)];
  return require(path);
}

describe("gulp-environments", function() {
  beforeEach(function() {
    delete process.env.NODE_ENV;
  });

  it("gives the environment a name", function() {
    var staging = environments.make("staging");

    expect(staging.$name).to.equal("staging");
  });

  it("takes the default environment from the process environment", function() {
    process.env.NODE_ENV = "development";

    environments.reset();

    expect(environments.development()).to.be.true;
    expect(environments.production()).to.be.false;
  });

  it("respects command line argument over process environment", function() {
    process.env.NODE_ENV = "production";
    process.argv.push("--env=development");

    environments = refresh("../");

    expect(environments.development()).to.be.true;
    expect(environments.production()).to.be.false;
  });

  it("distinguishes between environments", function() {
    environments.current(environments.development);

    expect(environments.development()).to.be.true;
    expect(environments.production()).to.be.false;
  });

  it("allows switching environments", function() {
    environments.current(environments.development);
    environments.current(environments.production);

    expect(environments.development()).to.be.false;
    expect(environments.production()).to.be.true;
  });
});
