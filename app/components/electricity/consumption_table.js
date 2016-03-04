'use strict';
import React, {Component, PropTypes} from 'react';
import moment from 'moment';
import ElectricityConsItem from './item_consumption';
import RaisedButton from 'material-ui/lib/raised-button';

import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';

import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRow from 'material-ui/lib/table/table-row';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';

export default class ConsumptionTable extends Component {
  static propTypes = {
    list: PropTypes.array,
  };

  static defaultProps = {
    list: [],
  };

  state = {
  };

  render() {
    const list = this.props.list;

    let body;

    if (list.length > 0) {
      body = list.map((elec, idx) => {
        return (<ElectricityConsItem key={elec.timestamp} {...elec}/>);
      });
    } else {
      body = (
        <TableRow>
          <TableRowColumn>Empty list</TableRowColumn>
        </TableRow>
      );
    }

    return (
      <Table selectable={false}
        height="200px">
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn>Month</TableHeaderColumn>
            <TableHeaderColumn>Day consumption</TableHeaderColumn>
            <TableHeaderColumn>Night consumption</TableHeaderColumn>
            <TableHeaderColumn>Summ</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {body}
        </TableBody>
      </Table>
    );
  }
}
