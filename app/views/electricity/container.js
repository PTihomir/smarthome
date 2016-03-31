'use strict';
import fetch from 'isomorphic-fetch';
import moment from 'moment';

import config from '../../config';

import React, {Component, PropTypes} from 'react';

import ExtendedPanel from './extended_panel.js';
import CompactPanel from './compact_panel.js';

import Tile from '../../components/tile/tile.js';

export const dimension = {
  width: 1,
  height: 1,
  expWidth: 3,
  expHeight: 2,
};

export default class TileElectricity extends Component {
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

  state = {
    initialized: false,
    list_raw: [],
    list_cons: [],
  };

  constructor() {
    super();

    this.handleSaveEdit = this.handleSaveEdit.bind(this);
    this.handleDeleteItem = this.handleDeleteItem.bind(this);
  }

  /**
   * Use list of consumption to calculate the monthly consumption.
   * @param  {array} list_of_consumptions [description]
   * @return {array}           [description]
   */
  processMonthConsumption(list_of_consumptions) {
    const object_cons = list_of_consumptions.reduce((prevValue, item) => {
      const timestamp = moment(item.timestamp).startOf('month').valueOf();

      if (!prevValue[timestamp]) {
        prevValue[timestamp] = {
          timestamp: timestamp,
          day: 0,
          night: 0,
        };
      }

      prevValue[timestamp].day += item.day;
      prevValue[timestamp].night += item.night;

      return prevValue;
    }, {});

    const list = Object.keys(object_cons).map((key) => {
      return object_cons[key];
    });

    return list;
  }

  componentDidMount() {
    this.fetchListData();
  }

  fetchListData() {
    fetch(config.base_url + '/electricity/list')
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          const error = new Error(response.statusText);
          error.response = response;
          throw error;
        }
      })
      .then((json) => {
        this.setState({
          initialized: true,
          list_raw: json.list_raw,
          list_cons: json.list_cons,
          monthly_consumption: this.processMonthConsumption(json.list_cons),
        });
      }).catch(function (ex) {
        console.log('parsing failed', ex);
      });
  }

  handleSaveEdit(data) {
    fetch(config.base_url + '/electricity/save', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
    })
    .then((json) => {
      if (json.status === 'ok') {
        this.fetchListData();
      }
    }).catch((ex) => {
      console.error('some error happened', ex);
    });
  }

  handleDeleteItem(data) {
    fetch(config.base_url + '/electricity/delete', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
    })
    .then((json) => {
      if (json.status === 'ok') {
        this.fetchListData();
      }
    }).catch((ex) => {
      console.log('parsing failed', ex);
    });
  }

  render() {
    if (!this.state.initialized) {
      return (<div></div>);
    }

    let bigContent = (
      <ExtendedPanel
        raw_list={this.state.list_raw}
        monthly_consumption={this.state.monthly_consumption}
        onSaveEdit={this.handleSaveEdit}
        onDelete={this.handleDeleteItem}
        visible={this.props.expanded}
        />
      );

    let lastMonthData = null;

    if (this.state.monthly_consumption.length > 0) {
      lastMonthData = this.state.monthly_consumption.slice(-1)[0];
    }

    let smallContent = (
      <CompactPanel data={lastMonthData}
        visible={!this.props.expanded}
        />
      );

    return (<Tile
        gridSize={this.props.gridSize}
        dimension={dimension}
        title="Electricity"
        expandable
        expanded={this.props.expanded}
        onToggleExpand={this.props.onToggleExpand}
        frontSide={smallContent}
        backSide={bigContent}
        />
      );
  }

}
