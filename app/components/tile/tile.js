import React, {Component, PropTypes} from 'react';

export const dimension = {
  width: 1,
  height: 1,
};

export default class Tile extends Component {

  static propTypes = {
    color: PropTypes.string,
    children: PropTypes.any,
  };

  static defaultProps = {
    color: '#CCC',
  };

  static getDimension() {
    return dimension;
  }

  getTile(children) {
    const {width, height} = this.constructor.getDimension();

    let styles = {
      margin: '25px',
      width: (250 * width - 50) + 'px',
      height: (250 * height - 50) + 'px',
      backgroundColor: this.props.color,
    };

    return (<div style={styles}>{children}</div>);
  }

  render() {
    return this.getTile(this.props.children);
  }
}

