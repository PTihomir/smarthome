'use strict';
import classes from './electricity.scss';
import React, {Component, PropTypes} from 'react';
import BarChart from '../../components/graph/BarChart';

import ConsumptionTable from '../../components/electricity/consumption_table';
import ElectricityTable from '../../components/electricity/electricity_table';

import RaisedButton from 'material-ui/lib/raised-button';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';

export default class ElectricityPanelExtended extends Component {
  static propTypes = {
    expanded: PropTypes.bool,
    raw_list: PropTypes.array,
    monthly_consumption: PropTypes.array,
    onSaveEdit: PropTypes.func,
    onDelete: PropTypes.func,
  };

  static defaultProps = {
    expanded: false,
    raw_list: [],
    monthly_consumption: [],
  }

  state = {
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

  handleSaveEdit(data) {
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
    const list_raw = this.props.raw_list.reverse();
    const list_consumption = this.props.monthly_consumption;

    const graph_data = [{
      name: 'Day cons',
      values: list_consumption.map((item, idx) => {
        return {
          x: item.timestamp,
          y: item.day,
        };
      }),
    }, {
      name: 'Night cons',
      values: list_consumption.map((item, idx) => {
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
      table = (<ConsumptionTable list={list_consumption} />);
    }

    return (
      <div>
        <div className="graph" style={{overflow: 'hidden'}}>
          <BarChart
            width={680}
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
