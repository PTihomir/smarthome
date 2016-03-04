/* global describe, beforeEach, it */
var should = require('should'); // eslint-disable-line no-unused-vars

function getTicks(domain, tickNumber) {
  const steps = [1, 2, 2.5, 5, 10];

  const coef = Math.pow(10, Math.floor(Math.log10(domain[1])) - 1);

  const step = coef * steps.filter(value => domain[1] / (value * coef) <= (tickNumber))[0];

  const ticks = Array(tickNumber + 1).fill(0)
          .map((d, i) => i * step);

  return ticks;
}

describe('Check getTicks method', function () {
  it('Simple ticks for 0-10', function () {
    const domain = [0, 10];
    getTicks(domain, 10).should.be.eql([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    getTicks(domain, 5).should.be.eql([0, 2, 4, 6, 8, 10]);
    getTicks(domain, 4).should.be.eql([0, 2.5, 5, 7.5, 10]);
    getTicks(domain, 2).should.be.eql([0, 5, 10]);
    getTicks(domain, 1).should.be.eql([0, 10]);
  });

  it('Simple ticks for 0-25', function () {
    const domain = [0, 25];
    getTicks(domain, 10).should.be.eql([0, 2.5, 5, 7.5, 10, 12.5, 15, 17.5, 20, 22.5, 25]);
    getTicks(domain, 5).should.be.eql([0, 5, 10, 15, 20, 25]);
  });

  it('Simple ticks for 0-1000', function () {
    const domain = [0, 1000];
    getTicks(domain, 10).should.be.eql([0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000]);
    getTicks(domain, 12).should.be.eql([0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200]);
  });

  // it('Simple ticks for 0-1', function () {
    // getTicks([0, 1], 10).should.be.eql([0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]);
    // getTicks([0, 1], 5).should.be.eql([0, 0.2, 0.4, 0.6, 0.8, 1]);
    // getTicks([0, 1], 4).should.be.eql([0, 2.5, 5, 7.5, 10]);
    // getTicks([0, 1], 2).should.be.eql([0, 5, 10]);
    // getTicks([0, 1], 1).should.be.eql([0, 10]);
  // });
});
