// Polyfill
Math.log10 = Math.log10 || function (x) {
  return Math.log(x) / Math.LN10;
};

function getTicks(domain, tickNumber) {
  const steps = [1, 2, 2.5, 5, 10];

  const coef = Math.pow(10, Math.floor(Math.log10(domain[1])) - 1);

  const step = coef * steps.filter(value => domain[1] / (value * coef) < (tickNumber))[0];

  const ticks = Array(tickNumber + 1).fill(0)
          .map((d, i) => i * step);

  return ticks;
}

export {
  getTicks,
};
