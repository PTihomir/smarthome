import React, {Component} from 'react';
import ElectricityPanel from '../../views/electricity/panel';

import Tile from './tile.js';

export const dimension = {
  width: 1,
  height: 1,
  expWidth: 3,
  expHeight: 2,
};

export default class TileElectricity extends Component {

  static defaultProps = {
    color: '#FAFAFF',
  };

  static getDimension() {
    return dimension;
  }

  constructor() {
    super();

    this.handleExpand = this.handleExpand.bind(this);
  }

  handleExpand(expanded) {
    this.setState({
      expanded: expanded,
    });
  }

  render() {
    return (<Tile
      dimension={dimension}
      title="Electricity"
      expandable
      onToggleExpand={this.handleExpand}
      >
        <ElectricityPanel expanded={this.state.expanded} />
      </Tile>);
  }

}
