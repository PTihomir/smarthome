// import React, {Component, PropTypes} from 'react';

import Tile from './tile.js';

export const dimension = {
  width: 1,
  height: 2,
};

export default class TileW extends Tile {

  static defaultProps = {
    color: '#C33',
  };

  static getDimension () {
    return dimension;
  }

}

