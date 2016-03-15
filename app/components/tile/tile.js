import classes from './tile.scss';
import variables from '../../style/variables';
import React, {Component, PropTypes} from 'react';
import IconButton from 'material-ui/lib/icon-button';
import FontIcon from 'material-ui/lib/font-icon';

export const dimension = {
  width: 1,
  height: 1,
  expWidth: 1,
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
  };

  constructor() {
    super();
    this.handleExpand = this.handleExpand.bind(this);
    this.handleHover = this.handleHover.bind(this);
  }

  state = {
    expanded: false,
    hovered: false,
  }

  handleExpand() {
    this.setState({
      expanded: !this.state.expanded,
      hovered: false,
    });
  }

  handleHover(e) {
    if (this.state.expanded) {
      return;
    }

    this.setState({
      hovered: e.type === 'mouseenter',
    });
  }

  render() {
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
        <div className={classes['tile__control']} style={{display: this.state.hovered || this.state.expanded ? 'flex' : 'none'}}>
          <span>{this.props.title}</span>
          <span>
            <IconButton
              onClick={this.handleExpand}
              tooltip={this.state.expanded ? 'Collapse' : 'Expand'}>
              <FontIcon className="material-icons">{this.state.expanded ? 'fullscreen_exit' : 'fullscreen'}</FontIcon>
            </IconButton>
          </span>
        </div>);
    }

    const classNameThing = classes['tile'] + ' ' + (this.state.expanded ? classes['tile--expanded'] : '');

    return (
        <div style={styles}
          className={classNameThing}
          onMouseEnter={this.handleHover} onMouseLeave={this.handleHover}>
          <div className="content">
            {this.props.children}
          </div>
          {control}
        </div>);
  }
}

