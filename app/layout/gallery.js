'use strict';
import React, {Component, PropTypes} from 'react';
// import ReactDOM from 'react-dom';

import Art from '../components/art/art.js';

export default class Gallery extends Component {
  static propTypes = {
    size: PropTypes.number,
  };

  static defaultProps = {
    size: 512,
  };

  state = {
    currentCounter: 0,
    counter: 1000,
    animationSpeed: 0,
    path: [],
    speed1: 9,
    speed2: 8,
    offset1: 0,
    offset2: 0,
    radius1: 110,
    radius2: 240,
  };

  constructor (props) {
    super(props);
    this.drawEnd = this.drawEnd.bind(this);
  }

  drawEnd (counter) {
    this.setState({
      currentCounter: counter,
    });
  }

  updateAnimationSpeed (event) {
    let value = parseInt(event.target.value, 10);

    if (!isNaN(value)) {
      this.setState({
        animationSpeed: value,
      });
    }
  }

  updateOuterSpeed (event) {
    let value = parseInt(event.target.value, 10);

    if (!isNaN(value)) {
      this.setState({
        speed2: value,
      });
    }
  }

  updateInnerSpeed (event) {
    let value = parseInt(event.target.value, 10);

    if (!isNaN(value)) {
      this.setState({
        speed1: value,
      });
    }
  }

  updateOuterRadius (event) {
    let value = parseInt(event.target.value, 10);

    if (!isNaN(value)) {
      this.setState({
        radius2: value,
      });
    }
  }

  updateInnerRadius (event) {
    let value = parseInt(event.target.value, 10);

    if (!isNaN(value)) {
      this.setState({
        radius1: value,
      });
    }
  }

  updateOuterOffset (event) {
    let value = parseInt(event.target.value, 10);

    if (!isNaN(value)) {
      this.setState({
        offset2: value,
      });
    }
  }

  updateInnerOffset (event) {
    let value = parseInt(event.target.value, 10);

    if (!isNaN(value)) {
      this.setState({
        offset1: value,
      });
    }
  }

  render () {
    return (<div>
        <Art size={this.props.size}
             counter={this.state.counter}
             animationSpeed={this.state.animationSpeed}
             speed1={this.state.speed1}
             speed2={this.state.speed2}
             offset1={this.state.offset1}
             offset2={this.state.offset2}
             radius1={this.state.radius1}
             radius2={this.state.radius2}
             onFinished={this.drawEnd} />
        <div>
          <span>Step: {this.state.currentCounter} / {this.state.counter}</span>
          <div>Animation speed:
              <input type="number"
                     defaultValue={this.state.animationSpeed}
                     onChange={this.updateAnimationSpeed.bind(this)} />
          </div>
          <div>Outer speed: <input type="number"
                     defaultValue={this.state.speed2}
                     onChange={this.updateOuterSpeed.bind(this)}/>
                     <input type="number"
                     defaultValue={this.state.offset2}
                     onChange={this.updateOuterOffset.bind(this)}/></div>
          <div>Inner speed: <input type="number"
                     defaultValue={this.state.speed1}
                     onChange={this.updateInnerSpeed.bind(this)}/>
                     <input type="number"
                     defaultValue={this.state.offset1}
                     onChange={this.updateInnerOffset.bind(this)}/></div>
          <div>Outer radius: <input type="number"
                     defaultValue={this.state.radius2}
                     onChange={this.updateOuterRadius.bind(this)}/></div>
          <div>Inner radius: <input type="number"
                     defaultValue={this.state.radius1}
                     onChange={this.updateInnerRadius.bind(this)}/></div>
        </div>
      </div>
    );
  }
}
