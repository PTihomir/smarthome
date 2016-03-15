'use strict';
import classes from './electricity.scss';
import config from '../../config';
import React, {Component} from 'react';
import fetch from 'isomorphic-fetch';
import BarChart from '../../components/graph/BarChart';
import moment from 'moment';

import ConsumptionTable from '../../components/electricity/consumption_table';
import ElectricityTable from '../../components/electricity/electricity_table';

import RaisedButton from 'material-ui/lib/raised-button';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';

export default class ElectricityPanel extends Component {
  static propTypes = {
  };

  state = {
    list_raw: [],
    list_cons: [],
    list_type: 2, // 1 - raw || 2 - consumption
    edit: false,
    new: false,
  };

  constructor() {
    super();
    this.toggleListType = this.toggleListType.bind(this);
    this.handleSaveEdit = this.handleSaveEdit.bind(this);
    this.handleDeleteItem = this.handleDeleteItem.bind(this);
    this.handleEditItem = this.handleEditItem.bind(this);
    this.handleNewItem = this.handleNewItem.bind(this);
    this.handleCancelEdit = this.handleCancelEdit.bind(this);
  }

  toggleListType(e, index, value) {
    this.setState({
      list_type: value,
      edit: value === 2 ? false : this.state.edit,
      new: value === 2 ? false : this.state.new,
    });
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
          list_raw: json.list_raw,
          list_cons: json.list_cons,
        });
      }).catch(function (ex) {
        console.log('parsing failed', ex);
      });
  }

  handleSaveEdit(data) {
    this.handleCancelEdit();

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

  handleEditItem(id) {
    this.setState({
      edit: id,
    });
  }

  handleNewItem() {
    this.setState({
      list_type: 1,
      new: true,
    });
  }

  handleCancelEdit() {
    this.setState({
      edit: false,
      new: false,
    });
  }

  render() {
    const list_raw = this.state.list_raw.reverse();

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

    let table;

    if (this.state.list_type === 1) {
      table = (<ElectricityTable
        list={list_raw}
        showNewForm={this.state.new}
        editItem={this.state.edit}
        onSave={this.handleSaveEdit}
        onDelete={this.handleDeleteItem}
        onEditItem={this.handleEditItem}
        onCancel={this.handleCancelEdit}
        />);
    } else {
      table = (<ConsumptionTable list={list_cons} />);
    }

    return (
      <div>
        <div className="graph">
          <BarChart
            width={700}
            height={180}
            data={graph_data}
          />
        </div>
        <div className={classes.list__control}>
          <SelectField value={this.state.list_type} onChange={this.toggleListType} className={classes.list__control__select}>
            <MenuItem value={1} primaryText="Electricity" />
            <MenuItem value={2} primaryText="Consumption" />
          </SelectField>
          <RaisedButton label="New" secondary onClick={this.handleNewItem} className={classes.list__control__button}/>
        </div>
        <div>
          {table}
        </div>
      </div>
    );
  }
}
