import React, {Component, PropTypes} from 'react';
import moment from 'moment';
// import d3 from 'd3';

class VerticalAxis extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    position: PropTypes.string.isRequired,
    label: PropTypes.string,
    scale: PropTypes.func.isRequired,
    ticks: PropTypes.array,
    tickSize: PropTypes.number,
    tickFormat: PropTypes.func,
  };

  static defaultProps = {
    width: 500,
    height: 300,
    tickSize: 4,
    tickFormat: (x) => x,
  };

  getTicks() {
    if (!this.props.ticks) {
      return;
    }

    const pos = this.props.position;
    const scale = this.props.scale;
    const tickSize = this.props.tickSize;
    const ticks = this.props.ticks;
    const x1 = pos === 'left' ? this.props.width : 0;
    const x2 = pos === 'left' ? this.props.width - tickSize : tickSize;

    const textX = pos === 'left' ? this.props.width - 5 - tickSize : 5 + tickSize;

    const textAnchor = pos === 'left' ? 'end' : 'start';

    return ticks.map((tick, idx) => {
      const y = this.props.height - scale(tick);
      const textY = y + 2;
      return (
        <g key={tick}>
          <line x1={x1} x2={x2} y1={y} y2={y}
            style={{stroke: '#333', strokeWidth: 1, opacity: idx === 0 ? 0 : 1}} />
          <text x={textX} y={textY}
            textAnchor={textAnchor}
            style={{stroke: '#333', fontSize: '10'}}>
              {this.props.tickFormat(tick)}
          </text>
        </g>
      );
    });
  }

  render() {
    const tickLines = this.getTicks();
    const line = {
      x1: this.props.width,
      x2: this.props.width,
      y1: 0,
      y2: this.props.height,
    };

    let label;
    if (this.props.label) {
      label = (
        <text transform={`translate(10,${this.props.height / 2}) rotate(270)`}
          textAnchor="middle"
          style={{stroke: '#333', fontSize: '12'}}>
          {this.props.label}
        </text>);
    }

    return (
      <g>
        {tickLines}
        <line {...line}
          style={{stroke: '#666', strokeWidth: 1}} />
        {label}
      </g>);
  }
}

class HorizontalAxis extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    position: PropTypes.string.isRequired,
    label: PropTypes.string,
    scale: PropTypes.func.isRequired,
    ticks: PropTypes.array,
    tickSize: PropTypes.number,
    tickFormat: PropTypes.func,
  };

  static defaultProps = {
    width: 500,
    height: 300,
    tickSize: 3,
    tickFormat: (x) => x,
  };

  getTicks() {
    if (!this.props.ticks) {
      return;
    }
    const tickSize = this.props.tickSize;
    const pos = this.props.position;
    const scale = this.props.scale;
    const y1 = pos === 'bottom' ? 0 : this.props.height;
    const y2 = pos === 'bottom' ? tickSize : this.props.height - tickSize;
    const ticks = this.props.ticks;

    return ticks.map((tick, idx) => {
      const x = scale(tick);
      const textY = 10 + tickSize;
      return (
        <g key={tick}>
          <line x1={x} x2={x} y1={y1} y2={y2}
            style={{stroke: '#333', strokeWidth: 2}} />
          <text x={x} y={textY}
            textAnchor="middle"
            style={{stroke: '#333', fontSize: 12}}>
              {this.props.tickFormat(tick)}
          </text>
        </g>
      );
    });
  }

  render() {
    const tickLines = this.getTicks();
    const line = {
      x1: 0,
      x2: this.props.width,
      y1: 0,
      y2: 0,
    };

    let label;
    if (this.props.label) {
      label = (
        <text transform={`translate(${this.props.width / 2}, ${this.props.height - 4})`}
          textAnchor="middle"
          style={{stroke: '#333', fontSize: '12'}}>
          {this.props.label}
        </text>);
    }

    return (
      <g>
        {tickLines}
        <line {...line}
          style={{stroke: '#666', strokeWidth: 1}} />
        {label}
      </g>);
  }
}

class HorizontalTimeAxis extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    position: PropTypes.string.isRequired,
    label: PropTypes.string,
    scale: PropTypes.func.isRequired,
    ticks: PropTypes.array,
    tickSize: PropTypes.number,
    tickFormat: PropTypes.func,
  };

  static defaultProps = {
    width: 500,
    height: 300,
    tickSize: 3,
    tickFormat: (x) => moment(x).format('MMM'),
  };

  getTicks() {
    if (!this.props.ticks) {
      return;
    }
    const tickSize = this.props.tickSize;
    const pos = this.props.position;
    const scale = this.props.scale;
    const y1 = pos === 'bottom' ? 0 : this.props.height;
    const y2 = pos === 'bottom' ? tickSize : this.props.height - tickSize;
    const ticks = this.props.ticks;

    return ticks.map((tick, idx) => {
      const x = scale(tick);
      const textY = 10 + tickSize;
      return (
        <g key={tick}>
          <line x1={x} x2={x} y1={y1} y2={y2}
            style={{stroke: '#333', strokeWidth: 2}} />
          <text x={x} y={textY}
            textAnchor="middle"
            style={{stroke: '#333', fontSize: 12}}>
              {this.props.tickFormat(tick)}
          </text>
        </g>
      );
    });
  }

  render() {
    const tickLines = this.getTicks();
    const line = {
      x1: 0,
      x2: this.props.width,
      y1: 0,
      y2: 0,
    };

    let label;
    if (this.props.label) {
      label = (
        <text transform={`translate(${this.props.width / 2}, ${this.props.height - 4})`}
          textAnchor="middle"
          style={{stroke: '#333', fontSize: '12'}}>
          {this.props.label}
        </text>);
    }

    return (
      <g>
        {tickLines}
        <line {...line}
          style={{stroke: '#666', strokeWidth: 1}} />
        {label}
      </g>);
  }
}

export default class Axis extends Component {
  static propTypes = {
    position: PropTypes.string.isRequired,
    type: PropTypes.string,
  };

  render() {
    const pos = this.props.position;

    if (pos === 'top' || pos === 'bottom') {
      if (this.props.type === 'datetime') {
        return (<HorizontalTimeAxis {...this.props} />);
      }
      return (<HorizontalAxis {...this.props} />);
    } else {
      return (<VerticalAxis {...this.props} />);
    }
  }
}
