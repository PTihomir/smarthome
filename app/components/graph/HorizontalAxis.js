import React, {Component, PropTypes} from 'react';
// import d3 from 'd3';

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

export default class VerticalAxis extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    position: PropTypes.string.isRequired,
    label: PropTypes.string,
    scale: PropTypes.func.isRequired,
    tickNumber: PropTypes.number,
  };

  static defaultProps = {
    width: 500,
    height: 300,
    tickNumber: 11,
  };

  getTicks() {
    const pos = this.props.position;
    const scale = this.props.scale;
    const ticks = getTicks(scale.domain(), this.props.tickNumber);
    const x1 = pos === 'left' ? 0 : this.props.width;
    const x2 = pos === 'left' ? 10 : this.props.width - 10;

    return ticks.map(tick => {
      const y = scale(tick);
      return <line x1={x1} x2={x2} y1={y} y2={y} style={{stroke: '#F00', strokeWidth: 2}} />
    });
  }

  render() {
    const tickLines = this.getTicks();
    const line = {
        x1: 0,
        x2: 0,
        y1: 0,
        y2: this.props.height,
      };

    return (
      <g>
        <line {...line}
          style={{stroke: '#F00', strokeWidth: 2}} />
      </g>);
  }
}
