'use strict';
import React, {Component, PropTypes} from 'react';
// import ReactDOM from 'react-dom';

import Icon from '../components/icons/icon.js';

export default class IconsLayout extends Component {

  static propTypes = {
    icons: PropTypes.array,
  };

  static defaultProps = {
    icons: [
      {set: 'datatable', name: 'add'},
      {set: 'other', name: 'icon-close'},
      {set: 'view_pickers', name: 'share'},
    ],
  };

  state = {
    index: 0,
  };

  changeIcons () {
    let index = (this.state.index + 1) % this.props.icons.length;

    this.setState({
      index: index,
    });
  }

  render () {
    const index = this.state.index;
    const iprev = (this.state.index + 1) % this.props.icons.length;
    const inext = (this.state.index + 2) % this.props.icons.length;

    return (<div>
      <div>
        <Icon set={this.props.icons[index].set} name={this.props.icons[index].name} size="lg"/>
        <p>Block element icon</p>
      </div>
      {/*<div>
        <span style={{fontSize: '20px'}}><Icon set={this.props.icons[iprev].set} name={this.props.icons[iprev].name} /> Small size</span>
      </div>
      <div>
        <span style={{fontSize: '30px'}}><Icon set={this.props.icons[iprev].set} name={this.props.icons[iprev].name} size="md" />Medium size</span>
      </div>
      <div>
        <span style={{fontSize: '40px'}}><Icon set={this.props.icons[index].set} name={this.props.icons[index].name} size="lg" />Large size</span>
      </div>
      <div>
        <span style={{fontSize: '60px'}}><Icon set={this.props.icons[inext].set} name={this.props.icons[inext].name} size="xlg" />Very Large size</span>
      </div>*/}
      <button onClick={this.changeIcons.bind(this)}>Change</button>
      </div>);
  }
}
