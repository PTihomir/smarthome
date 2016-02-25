import React, {Component, PropTypes} from 'react';

export default class Bar extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    topOffset: PropTypes.number.isRequired,
    leftOffset: PropTypes.number.isRequired,
    color: PropTypes.string,
  };

  static defaultProps = {
    color: '#2196F3',
  };

  render() {
    return (
      <rect width={this.props.width}
        height={this.props.height}
        transform={`translate(${this.props.leftOffset}, ${this.props.topOffset})`}
        style={{ fill: this.props.color }}
      />
    );
  }
}
