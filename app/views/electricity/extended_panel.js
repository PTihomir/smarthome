'use strict';
import classes from './electricity.scss';

import classNames from 'classnames/bind';
import React, {Component, PropTypes} from 'react';
import moment from 'moment';

import BarChart from '../../components/graph/BarChart';

import variables from '../../style/variables';

import ConsumptionTable from '../../components/electricity/consumption_table';
import ElectricityTable from '../../components/electricity/electricity_table';

import ElectricityEditForm from './edit_electricity.js';

import RaisedButton from 'material-ui/lib/raised-button';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';

const cx = classNames.bind(classes);

export default class ElectricityPanelExtended extends Component {
  static propTypes = {
    raw_list: PropTypes.array,
    monthly_consumption: PropTypes.array,
    onSaveEdit: PropTypes.func,
    onDelete: PropTypes.func,
    visible: PropTypes.bool,
  };

  static defaultProps = {
    raw_list: [],
    monthly_consumption: [],
    visible: true,
  }

  state = {
    list_type: 2, // 1 - raw || 2 - consumption
    edit: false,
    new: false,
  };

  constructor(props) {
    super(props);
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
      edit: false,
      new: false,
    });
  }

  handleSaveEdit(data) {
    const earlierItems = this.props.raw_list.filter(item => item.timestamp < data.timestamp);
    const afterItems = this.props.raw_list.filter(item => item.timestamp > data.timestamp);

    if (earlierItems.length > 0) {
      const prev = earlierItems.pop();
      if (data.high_cost < prev.high_cost || data.low_cost < prev.low_cost) {
        console.error('Invalid value, must be bigger');
        return;
      }
    }

    if (afterItems.length > 0) {
      const next = afterItems.shift();
      if (data.high_cost > next.high_cost || data.low_cost > next.low_cost) {
        console.error('Invalid value, must be less');
        return;
      }
    }

    this.handleCancelEdit();

    if (this.props.onSaveEdit) {
      this.props.onSaveEdit(data);
    }
  }

  handleDeleteItem(data) {
    if (this.props.onDelete) {
      this.props.onDelete(data);
    }
  }

  handleEditItem(id) {
    const electricityObject = this.props.raw_list.filter(item => item.timestamp === id);

    if (electricityObject.length > 0) {
      this.setState({
        edit: electricityObject[0],
      });
    } else {
      console.error(`Item ${id} not found`);
    }
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

  renderEditForm(entry) {
    return (
      <ElectricityEditForm
        timestamp={entry.timestamp}
        high_cost={entry.high_cost}
        low_cost={entry.low_cost}
        onSave={this.handleSaveEdit}
        onCancel={this.handleCancelEdit}
      />
      );
  }

  render() {
    const list_consumption = this.props.monthly_consumption;

    const graph_data = [{
      name: 'Night cons',
      color: variables.colors.nightEnergy,
      values: list_consumption.map((item, idx) => {
        return {
          x: item.timestamp,
          y: item.night,
        };
      }),
    }, {
      name: 'Day cons',
      color: variables.colors.dayEnergy,
      values: list_consumption.map((item, idx) => {
        return {
          x: item.timestamp,
          y: item.day,
        };
      }),
    }];

    let content;

    if (this.state.edit) {
      content = this.renderEditForm(this.state.edit);
    } else if (this.state.new) {
      const emptyObject = {
        timestamp: moment().valueOf(),
      };
      content = this.renderEditForm(emptyObject);
    } else if (this.state.list_type === 1) {
      const list_raw = this.props.raw_list.slice().reverse();
      content = (<ElectricityTable
        list={list_raw}
        onDeleteItem={this.handleDeleteItem}
        onEditItem={this.handleEditItem}
        />);
    } else {
      content = (<ConsumptionTable
        list={list_consumption.slice().reverse()} />);
    }

    return (
      <div className={cx('extended-panel')}>
        <div className={cx('extended-panel__graph')} style={{overflow: 'hidden', height: '180px'}}>
          {this.props.visible ? (
            <BarChart
              data={graph_data}
            />) : null}
        </div>
        <div className={cx('extended-panel__view-selector')}>
          <SelectField
            value={this.state.list_type}
            onChange={this.toggleListType}
            className={cx('extended-panel__view-selector__select')}
            underlineStyle={{borderColor: '#333'}}
            iconStyle={{fill: '#333'}}>
            <MenuItem value={1} primaryText="Electricity" />
            <MenuItem value={2} primaryText="Consumption" />
          </SelectField>
          <RaisedButton label="New"
            secondary
            onClick={this.handleNewItem}
            className={cx('extended-panel__view-selector__button')}
            />
        </div>
        <div className={cx('extended-panel__content')}>
          {content}
        </div>
      </div>
    );
  }
}
