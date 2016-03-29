'use strict';

import variables from '../style/variables';
import React, {Component, PropTypes} from 'react';
import Tile from '../components/tile/tile.js';
import TileElectricity from '../components/tile/tile_electricity.js';

export default class TileLayout extends Component {

  static propTypes = {
    gridSize: PropTypes.number,
    gridWidth: PropTypes.number,
  };

  static defaultProps = {
    gridSize: variables.sizes.tileLayoutGridSize,
    gridWidth: variables.sizes.tileLayoutTileWidth,
  };

  state = {
    tiles: [
      { id: 2, order: 0, constructor: TileElectricity, expanded: false },
      { id: 0, order: 1, constructor: Tile, expanded: false },
      { id: 1, order: 4, constructor: Tile, expanded: false },
    ],
    fixedPosition: null,
  };

  constructor(props) {
    super(props);

    this.handleToggleExpand = this.handleToggleExpand.bind(this);
  }

  handleToggleExpand(id, expandState) {
    console.log(id, expandState);
    let tiles = this.state.tiles.slice();
    tiles.forEach((tile) => {
      if (tile.id === id) {
        tile.expanded = expandState;
      }
    });
    this.setState({
      tiles: tiles,
    });
  }

  renderTiles() {
    const gridSize = this.props.gridSize;
    const gridWidth = this.props.gridWidth;

    let reserved = [];

    const getCoord = (position) => ({ x: position % gridWidth, y: Math.floor(position / gridWidth) });
    const getPosition = (x, y) => y * gridWidth + x;
    const findPosition = (pos, {width, height}) => {
      const {x, y} = getCoord(pos);
      // if not more space in this row, then go to next row
      if ((x + width) > gridWidth) {
        return findPosition(getPosition(0, y + 1), {width, height});
      }

      // filter reserved places which are in the element
      let filteredResult = reserved.map((pos) => getCoord(pos))
        .filter(({x: rx, y: ry}) => {
          return ((rx >= x) && (rx < x + width)) && ((ry >= y) && (ry < y + height));
        }).length;

      if (filteredResult > 0) {
        return findPosition(pos + 1, {width, height});
      }

      return {x, y};
    };

    if (typeof this.state.fixedPosition === 'number') {
      reserved.push(this.state.fixedPosition);
    }

    // Define tiles.
    let tiles = this.state.tiles.map((tile, index) => {
      let {width, height, expWidth, expHeight} = tile.constructor.getDimension();

      if (tile.expanded) {
        width = expWidth;
        height = expHeight;
      }

      // Check if position is available
      // Check if tile is outside area

      // Check if positions are available
      const {x, y} = findPosition(0, {width, height});

      let styles = {
        position: 'absolute',
        width: gridSize * width + 'px',
        height: gridSize * height + 'px',
        left: x * gridSize + 'px',
        top: y * gridSize + 'px',
        transition: 'left 0.5s, top 0.5s, width 0.2s, height 0.2s',
      };

      // Mark position in reserved array
      for (let i = x; i < x + width; i++) {
        for (let j = y; j < y + height; j++) {
          reserved.push(getPosition(i, j));
        }
      }

      return (<div style={styles} key={tile.id}>{
        React.createElement(tile.constructor, {
          expanded: tile.expanded,
          onToggleExpand: (expandState) => { this.handleToggleExpand(tile.id, expandState); },
        }, `Tile: ${tile.order}`)}</div>);
    });

    return tiles;
  }

  // changeFixed() {
  //   this.setState({
  //     fixedPosition: this.state.fixedPosition === null ? 0 : (this.state.fixedPosition + 1) % 10,
  //   });
  // }

  render() {
    let tiles = this.renderTiles();
    let styles = {
      width: this.props.gridSize * this.props.gridWidth + 'px',
      height: this.props.gridSize * 4 + 'px',
      border: '1px solid grey',
      margin: '10px',
      position: 'relative',
    };

    return (
      <div style={styles}>
        <span>{this.state.fixedPosition}</span>
        {tiles}
      </div>
    );
  }
}
