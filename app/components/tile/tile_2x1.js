// import React, {Component, PropTypes} from 'react';

import Tile from './tile.js';

export const dimension = {
  width: 2,
  height: 1,
};

export default class TileElectricity extends Tile {

  static defaultProps = {
    color: '#3C3',
  };

  static getDimension() {
    return dimension;
  }

}

