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
    if (this.props.expanded) {
      return this.renderExpanded();
    } else {
      return this.renderCollapsed();
    }
  }

  renderCollapsed() {
    const {width, height} = this.props.dimension;

    let styles = {
      margin: '25px',
      width: (variables.sizes.tileLayoutGridSize * width - 50) + 'px',
      height: (variables.sizes.tileLayoutGridSize * height - 50) + 'px',
      backgroundColor: this.props.color,
    };
    let control;

    if (this.props.expandable) {
      control = (
        <div className={classes['tile__control']} style={{display: this.state.hovered ? 'flex' : 'none'}}>
          <span>{this.props.title}</span>
          <span>
            <IconButton
              onClick={this.handleExpand}
              tooltip="Expand">
              <FontIcon className="material-icons">fullscreen</FontIcon>
            </IconButton>
          </span>
        </div>);
    }

    let className = cx({
      'tile': true,
      'tile--collapsed': true,
    });

    return (
        <div style={styles}
          className={className}
          onMouseEnter={this.handleHover} onMouseLeave={this.handleHover}>
          <div className={cx('tile__content')}>
            {this.props.children}
          </div>
          {control}
        </div>);
  }

  renderExpanded() {
    const {expWidth: width, expHeight: height} = this.props.dimension;

    let styles = {
      margin: '25px',
      width: (variables.sizes.tileLayoutGridSize * width - 50) + 'px',
      height: (variables.sizes.tileLayoutGridSize * height - 50) + 'px',
      backgroundColor: this.props.color,
    };
    let control;

    if (this.props.expandable) {
      control = (
        <div className={classes['tile__control']}>
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
      'tile--expanded': true,
    });

    return (
        <div style={styles}
          className={className}
          onMouseEnter={this.handleHover} onMouseLeave={this.handleHover}>
          <div className={cx('tile__content')}>
            {this.props.children}
          </div>
          {control}
        </div>);
  }
}

