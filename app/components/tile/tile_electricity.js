import React, {Component, PropTypes} from 'react';
import ElectricityContainer from '../../views/electricity/container';

import Tile from './tile.js';

export const dimension = {
  width: 1,
  height: 1,
  expWidth: 3,
  expHeight: 3,
};

export default class TileElectricity extends Component {
  static propTypes = {
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

  constructor() {
    super();
  }

  render() {
    return (<Tile
      dimension={dimension}
      title="Electricity"
      expandable
      expanded={this.props.expanded}
      onToggleExpand={this.props.onToggleExpand}
      >
        <ElectricityContainer expanded={this.props.expanded} />
      </Tile>);
  }

}
