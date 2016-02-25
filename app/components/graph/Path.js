import React, {Component, PropTypes} from 'react';
import d3 from 'd3';

export default class Path extends Component {
  static propTypes = {
    values: PropTypes.array.isRequired, // [[x, y], ...]
    color: PropTypes.string,
    onEnter: PropTypes.func,
    onLeave: PropTypes.func,
    dataIndex: PropTypes.number,
  };

  static defaultProps = {
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
    const lineGenerator = d3.svg.line();

    const styles = {
      stroke: this.props.color,
      fill: 'transparent',
      strokeWidth: 3,
    };

    return (
      <path
        style={styles}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        d={lineGenerator(this.props.values)}
        />
    );
  }
}
