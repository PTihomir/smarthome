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
    foregroundColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    title: PropTypes.string,
    expandable: PropTypes.bool,
    expanded: PropTypes.bool,
    onToggleExpand: PropTypes.func,
  };

  static getDimension() {
    return dimension;
  }

  static defaultProps = {
    foregroundColor: variables.colors.tileForeground,
    backgroundColor: variables.colors.tileBackground,
    title: 'Dummy tile',
    expandable: true,
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
    let styles = {
      backgroundColor: this.props.backgroundColor,
      color: this.props.foregroundColor,
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
    if (this.props.frontSide || this.props.children) {
      frontSide = (
        <div className={cx('tile__content', 'tile__content--front')}
          style={{boxShadow: `2px 2px 1px 0px ${variables.colors.tileShadow}`}}>
          {this.props.frontSide ? this.props.frontSide : this.props.children}
          {frontControl}
        </div>
      );
    }

    if (this.props.backSide) {
      backSide = (
        <div className={cx('tile__content', 'tile__content--back')}
          style={{boxShadow: `2px 2px 1px 0px ${variables.colors.tileShadow}`}}>
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
        >
          {frontSide}
          {backSide}
      </div>);
  }
}

