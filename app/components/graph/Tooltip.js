import React, {Component, PropTypes} from 'react';
import { StyleSheet } from 'react-look';

export default class Tooltip extends Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    children: PropTypes.node,
    show: PropTypes.bool,
    showSpeed: PropTypes.number,
    hideSpeed: PropTypes.number,
  };

  static defaultProps = {
    show: false,
    showSpeed: 600,
    hideSpeed: 250,
  };

  state = {
    visible: false,
    hovered: false,
  };

  constructor(props) {
    super(props);

    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.show && !newProps.show) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.timeout = false;
        this.toggleTooltip(false);
      }, this.props.showSpeed);
    } else if (!this.props.show && newProps.show) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.timeout = false;
        this.toggleTooltip(true);
      }, this.props.showSpeed);
    }
  }

  // shouldComponentUpdate(newProps, newState) {
  //   if (!this.state.visible && !newState.visible) {
  //     return false;
  //   }
  //   return true;
  // }

  toggleTooltip(show) {
    this.setState({
      visible: show,
    });
  }

  handleMouseEnter() {
    this.setState({
      hovered: true,
    });
  }

  handleMouseLeave() {
    this.setState({
      hovered: false,
    });
  }

  render() {
    const isVisible = (this.state.visible || this.state.hovered);

    const inStyle = {
      top: isVisible ? this.props.width / 2 : 0,
      left: isVisible ? this.props.height / 2 : 0,
      display: isVisible ? 'block' : 'none',
    };

    return (
      <div className={style.tooltip}
        style={inStyle}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}>
        {this.props.children}
      </div>
    );
  }
}

const style = StyleSheet.create({
  tooltip: {
    backgroundColor: '#FFF',
    border: '1px solid #333',
    borderRadius: 5,
    position: 'absolute',
    padding: 8,
    marginTop: -40,
    marginLeft: -60,
  },
});
