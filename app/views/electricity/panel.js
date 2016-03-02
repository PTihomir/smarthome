'use strict';
import config from '../../config';
import React, {Component} from 'react';
import fetch from 'isomorphic-fetch';
import BarChart from '../../components/graph/BarChart';
import moment from 'moment';

import ElectricityList from './list';

export default class ElectricityPanel extends Component {
  static propTypes = {
  };

  state = {
    list_raw: [],
    list_cons: [],
  };

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
          list_raw: json.list_raw,
          list_cons: json.list_cons,
        });
      }).catch(function (ex) {
        console.log('parsing failed', ex);
      });
  }

  saveEdit(data) {
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

  deleteItem(data) {
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
    const list_raw = this.state.list_raw;

    const object_cons = this.state.list_cons.reduce((prevValue, item) => {
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

    const list_cons = Object.keys(object_cons).map((key) => {
      return object_cons[key];
    });

    // const scale = 700.0 / list_cons.length;

    const graph_data = [{
      name: 'Day cons',
      values: list_cons.map((item, idx) => {
        return {
          x: item.timestamp,
          y: item.day,
        };
      }),
    }, {
      name: 'Night cons',
      values: list_cons.map((item, idx) => {
        return {
          x: item.timestamp,
          y: item.night,
        };
      }),
    }];

    return (
      <div>
        <div className="graph">
          <BarChart
            width={700}
            height={180}
            data={graph_data}
          />
        </div>
        <ElectricityList list_raw={list_raw} list_cons={list_cons} onSave={this.saveEdit.bind(this)} onDelete={this.deleteItem.bind(this)} />
      </div>
    );
  }
}
