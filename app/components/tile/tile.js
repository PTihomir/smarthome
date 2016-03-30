import classes from './tile.scss';
import classNames from 'classnames/bind';
import variables from '../../style/variables';
import React, {Component, PropTypes} from 'react';
import IconButton from 'material-ui/lib/icon-button';
import FontIcon from 'material-ui/lib/font-icon';

let cx = classNames.bind(classes);

export const dimension = {
  width: 1,
  height: 1,
  expWidth: 2,
  expHeight: 1,
};

export default class Tile extends Component {

  static propTypes = {
    children: PropTypes.any,
    frontSide: PropTypes.any,
    backSide: PropTypes.any,
    color: PropTypes.string,
    dimension: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
      expWidth: PropTypes.number,
      expHeight: PropTypes.number,
    }),
    title: PropTypes.string,
    expandable: PropTypes.bool,
    expanded: PropTypes.bool,
    onToggleExpand: PropTypes.func,
  };

  static getDimension() {
    return dimension;
  }

  static defaultProps = {
    color: '#CCC',
    dimension: dimension,
    title: 'Dummy tile',
    expandable: true,
    expanded: false,
  };

  constructor() {
    super();
    this.handleExpand = this.handleExpand.bind(this);
    this.handleHover = this.handleHover.bind(this);
  }

  state = {
    hovered: false,
  }

  handleExpand() {
    this.props.onToggleExpand(!this.props.expanded);

    this.setState({
      hovered: false,
    });
  }

  handleHover(e) {
    if (this.props.expanded) {
      return;
    }

    this.setState({
      hovered: e.type === 'mouseenter',
    });
  }

  render() {
    const {width, height, expWidth, expHeight} = this.props.dimension;
    let tileWidth, tileHeight;

    if (!this.props.expanded) {
      tileWidth = (variables.sizes.tileLayoutGridSize * width - 50) + 'px';
      tileHeight = (variables.sizes.tileLayoutGridSize * height - 50) + 'px';
    } else {
      tileWidth = (variables.sizes.tileLayoutGridSize * expWidth - 50) + 'px';
      tileHeight = (variables.sizes.tileLayoutGridSize * expHeight - 50) + 'px';
    }

    let styles = {
      margin: '25px',
      width: tileWidth,
      height: tileHeight,
      backgroundColor: this.props.color,
    };

    let frontControl, backControl;
    if (this.props.expandable) {
      frontControl = (
        <div className={cx('tile__control', 'tile__control--front')} style={{display: this.state.hovered ? 'flex' : 'none'}}>
          <span>{this.props.title}</span>
          <span>
            <IconButton
              onClick={this.handleExpand}
              tooltip="Expand">
              <FontIcon className="material-icons">fullscreen</FontIcon>
            </IconButton>
          </span>
        </div>);

      backControl = (
        <div className={cx('tile__control', 'tile__control--back')}>
          <span>{this.props.title}</span>
          <span>
            <IconButton
              onClick={this.handleExpand}
              tooltip="Collapse">
              <FontIcon className="material-icons">fullscreen_exit</FontIcon>
            </IconButton>
          </span>
        </div>);
    }

    let className = cx({
      'tile': true,
      'tile--expanded': this.props.expanded,
      'tile--collapsed': !this.props.expanded,
    });

    let frontSide, backSide;
    if (this.props.frontSide || this.props.children) {
      frontSide = (
        <div className={cx('tile__content', 'tile__content--front')}>
          {this.props.frontSide ? this.props.frontSide : this.props.children}
          {frontControl}
        </div>
      );
    }

    if (this.props.backSide) {
      backSide = (
        <div className={cx('tile__content', 'tile__content--back')}>
          {this.props.backSide}
          {backControl}
        </div>
      );
    }

    return (
        <div style={styles}
          className={className}
          onMouseEnter={this.handleHover} onMouseLeave={this.handleHover}>
            {frontSide}
            {backSide}
        </div>);
  }
}

