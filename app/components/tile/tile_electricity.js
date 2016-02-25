import React from 'react';
import ElectricityPanel from '../../views/electricity/panel';

import Tile from './tile.js';

export const dimension = {
  width: 3,
  height: 2,
};

export default class TileElectricity extends Tile {

  static defaultProps = {
    color: '#FAFAFF',
  };

  static getDimension() {
    return dimension;
  }

  render() {
    return this.getTile(
      <ElectricityPanel />
      );
  }

}
