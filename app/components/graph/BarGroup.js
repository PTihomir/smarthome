import React, {Component, PropTypes} from 'react';
import Bar from './Bar';

export default class BarGroup extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    leftOffset: PropTypes.number.isRequired,
    values: PropTypes.array.isRequired, // {color: '', height: ''}
    stacked: PropTypes.bool.isRequired,
    grouped: PropTypes.bool,
    padding: PropTypes.number,
    onEnter: PropTypes.func,
    onLeave: PropTypes.func,
    dataIndex: PropTypes.number,
  };

  static defaultProps = {
    grouped: false,
    padding: 0.1,
  };

  constructor(props) {
    super(props);

    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  handleMouseEnter(e) {
    if (this.props.onEnter) {
      this.props.onEnter(e.pageX, e.pageY, this.props.dataIndex);
    }
  }

  handleMouseLeave(e) {
    if (this.props.onLeave) {
      this.props.onLeave(e.pageX, e.pageY, this.props.dataIndex);
    }
  }

  render() {
    // Set grouped to false if bars are stacked.
    const isGrouped = this.props.stacked ? false : this.props.grouped;

    const values = isGrouped ? this.props.values.filter(value => value.height !== 0) : this.props.values;

    let padding = this.props.width * this.props.padding;
    const width = this.props.width - (2 * padding);
    const barWidth = this.props.stacked ? width : width / this.props.values.length;

    // padding and padding will differ only for grouped, where items are missing
    if (isGrouped) {
      padding = padding + (width - barWidth * values.length) / 2;
    }

    let lastTopOffset = this.props.height;
    const topOffsets = values.map(value => {
      if (this.props.stacked) {
        lastTopOffset =  lastTopOffset - value.height;
      } else {
        lastTopOffset =  this.props.height - value.height;
      }
      return lastTopOffset;
    });

    const bars = values.map((value, idx) => {
      const leftOffset = this.props.stacked ? 0 : idx * barWidth;
      return (
        <Bar key={idx}
          width={barWidth}
          height={value.height}
          topOffset={topOffsets[idx]}
          leftOffset={padding + leftOffset}
          color={value.color}
        />
      );
    });

    return (
      <g transform={`translate(${this.props.leftOffset}, 0)`}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}>
        {bars}
      </g>
    );
  }
}
