'use strict';
import config from '../../config';

import React, {Component, PropTypes} from 'react';

import Tile from '../../components/tile/tile.js';

export const dimension = {
  width: 1,
  height: 1,
  // expWidth: 2,
  // expHeight: 2,
};

export default class FlowerTile extends Component {
  static propTypes = {
    gridSize: PropTypes.number,
    color: PropTypes.string,
    expanded: PropTypes.bool,
    onToggleExpand: PropTypes.func,
  };

  static defaultProps = {
    color: '#FAFAFF',
    expanded: false,
  };

  static getDimension() {
    return dimension;
  }

  constructor(props) {
    super(props);
  }

  render() {
    const content = (`Flower life`);

    return (<Tile
        dimension={dimension}
        title="Plants"
        frontSide={content}
        />
      );
  }

}