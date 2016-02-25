'use strict';
import React, {Component, PropTypes} from 'react';
import request from 'superagent';
import moment from 'moment';
import ConsumptionTable from '../../components/electricity/consumption_table';
import ElectricityTable from '../../components/electricity/electricity_table';

import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';

export default class ElectricityList extends Component {
  static propTypes = {
    list_raw: PropTypes.array,
    list_cons: PropTypes.array,
    onSave: PropTypes.func,
    onDelete: PropTypes.func,
  };

  state = {
    list_type: 1, // 1 - raw || 2 - consumption
  };

  toggleListType(e, index, value) {
    this.setState({
      list_type: value,
    });
  }

  render() {
    let table;

    if (this.state.list_type === 1) {
      table = (<ElectricityTable list={this.props.list_raw} onSave={this.props.onSave} onDelete={this.props.onDelete} />);
    } else {
      table = (<ConsumptionTable list={this.props.list_cons} />);
    }

    return (
      <div>
        <div>
          <SelectField value={this.state.list_type} onChange={this.toggleListType.bind(this)}>
            <MenuItem value={1} primaryText="Electricity" />
            <MenuItem value={2} primaryText="Consumption" />
          </SelectField>
        </div>
          {table}
      </div>
    );
  }
}
