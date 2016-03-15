'use strict';
import classes from './electricity.scss';
import React, {Component, PropTypes} from 'react';
// import moment from 'moment';
import ConsumptionTable from '../../components/electricity/consumption_table';
import ElectricityTable from '../../components/electricity/electricity_table';

import RaisedButton from 'material-ui/lib/raised-button';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';

export default class ElectricityList extends Component {
  static propTypes = {
    list_raw: PropTypes.array,
    list_cons: PropTypes.array,
    onSave: PropTypes.func,
    onDelete: PropTypes.func,
  };

  constructor() {
    super();

    this.toggleListType = this.toggleListType.bind(this);
  }

  state = {
    list_type: 2, // 1 - raw || 2 - consumption
  };

  style = {
    control: {
    },
    control__select: {

    },
    control__new: {

    },
  }

  toggleListType(e, index, value) {
    this.setState({
      list_type: value,
    });
  }

  onNew() {
    this.setState({
      edit: true,
    });
  }

  render() {
    let table;

    if (this.state.list_type === 1) {
      table = (<ElectricityTable showNewForm={this.state.edit} list={this.props.list_raw} onSave={this.props.onSave} onDelete={this.props.onDelete} />);
    } else {
      table = (<ConsumptionTable list={this.props.list_cons} />);
    }

    return (
      <div>
        <div styles={this.style} className={classes.list__control}>
          <SelectField value={this.state.list_type} onChange={this.toggleListType} className={classes.list__control__select}>
            <MenuItem value={1} primaryText="Electricity" />
            <MenuItem value={2} primaryText="Consumption" />
          </SelectField>
          <RaisedButton label="New" secondary onClick={() => {}} className={classes.list__control__button}/>
        </div>
          {table}
      </div>
    );
  }
}
