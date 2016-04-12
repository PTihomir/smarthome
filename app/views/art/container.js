'use strict';
import config from '../../config';

import React, {Component, PropTypes} from 'react';

import Tile from '../../components/tile/tile.js';

import Art from '../../components/art/art.js';

export const dimension = {
  width: 2,
  height: 2,
  // expWidth: 2,
  // expHeight: 2,
};

export default class ArtTile extends Component {
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
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
    const size = Math.min(this.props.width, this.props.height) - 30; // subtract the padding

    const content = (
      <Art size={size}
        radius1={size * 0.2}
        radius2={size * 0.49}
        speed1={Math.round(Math.random() * 10) + 1}
        speed2={Math.round(Math.random() * 10) + 1}
        onClick={() => { this.forceUpdate(); }}
      />
    );

    return (<Tile
        dimension={dimension}
        title="Artwork"
        frontSide={content}
        />
      );
  }

}
