import classNames from 'classnames/bind';

import classes from './tile.scss';
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
    title: PropTypes.string,
    expandable: PropTypes.bool,
    expanded: PropTypes.bool,
    onToggleExpand: PropTypes.func,
    onClick: PropTypes.func,
  };

  static getDimension() {
    return dimension;
  }

  static defaultProps = {
    title: 'Dummy tile',
    expandable: false,
    expanded: false,
  };

  constructor(props) {
    super(props);
    this.handleExpand = this.handleExpand.bind(this);
    this.handleHover = this.handleHover.bind(this);
    this.handleMouseTouch = this.handleMouseTouch.bind(this);
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

  handleMouseTouch(e) {
    if (this.props.expanded || this.state.hovered) {
      return;
    }

    this.setState({
      hovered: e.type === 'touchend',
    });
  }

  render() {
    const c = variables.colors;
    const bColor = this.props.expanded ? c.tileExpandedBackground : c.tileBackground;
    const fColor = this.props.expanded ? c.tileExpandedForeground : c.tileForeground;

    let styles = {
      backgroundColor: bColor,
      color: fColor,
    };

    let frontControl, backControl;
    if (this.props.expandable) {
      frontControl = (
        <div className={cx('tile__control', 'tile__control--front')}
          style={{
            display: this.state.hovered ? 'flex' : 'none',
            backgroundColor: variables.colors.tileControlBackground,
            color: variables.colors.tileControlForeground,
          }}>
          <span>{this.props.title}</span>
          <span>
            <IconButton
              iconStyle={{
                color: variables.colors.tileControlForeground,
              }}
              onClick={this.handleExpand}
              tooltip="Expand">
              <FontIcon className="material-icons">fullscreen</FontIcon>
            </IconButton>
          </span>
        </div>);

      backControl = (
        <div className={cx('tile__control', 'tile__control--back')}
          style={{
            backgroundColor: variables.colors.tileControlBackground,
            color: variables.colors.tileControlForeground,
          }}>
          <span>{this.props.title}</span>
          <span>
            <IconButton
              iconStyle={{
                color: variables.colors.tileControlForeground,
              }}
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
      'tile--hovered': this.state.hovered,
    });

    let frontSide, backSide;
    const tileContentStyle = {boxShadow: `2px 2px 0px 0px ${variables.colors.tileShadow}`};

    // Render front side
    if (this.props.frontSide || this.props.children) {
      frontSide = (
        <div className={cx('tile__content', 'tile__content--front')}
          style={tileContentStyle}>
          {this.props.frontSide ? this.props.frontSide : this.props.children}
          {frontControl}
        </div>
      );
    }

    // Render back side
    if (this.props.backSide) {
      backSide = (
        <div className={cx('tile__content', 'tile__content--back')}
          style={tileContentStyle}>
          {this.props.backSide}
          {backControl}
        </div>
      );
    }

    return (
      <div style={styles}
        className={className}
        onMouseEnter={this.handleHover}
        onMouseLeave={this.handleHover}
        onTouchStart={this.handleMouseTouch}
        onTouchEnd={this.handleMouseTouch}
        onClick={this.props.onClick}
        >
          {frontSide}
          {backSide}
      </div>);
  }
}

