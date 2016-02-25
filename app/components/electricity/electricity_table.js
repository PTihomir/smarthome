'use strict';
import React, {Component, PropTypes} from 'react';
import ElectricityItem from './item_electricity';
import ElectricityItemEdit from './edit_electricity';
import RaisedButton from 'material-ui/lib/raised-button';

import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRow from 'material-ui/lib/table/table-row';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';

export default class ElectricityTable extends Component {

  static propTypes = {
    list: PropTypes.array,
    onSave: PropTypes.func,
    onDelete: PropTypes.func,
  };

  static defaultProps = {
    list: [],
  };

  state = {
    edit: false,
  };

  onEdit(id) {
    console.log('ping', id);
    this.setState({
      edit: id,
    });
  }

  onNew() {
    this.setState({
      edit: true,
    });
  }

  saveEdit(data) {
    this.props.onSave(data);
    this.setState({
      edit: false,
    });
  }

  cancelEdit() {
    this.setState({
      edit: false,
    });
  }

  deleteItem(timestamp) {
    this.props.onDelete({
      timestamp: timestamp,
    });
  }

  render() {
    const list = this.props.list;

    let body;
    let footer;

    if (list.length > 0) {
      body = list.map((elec, idx) => {
        if (elec.timestamp === this.state.edit) {
          return (<ElectricityItemEdit key={elec.timestamp} {...elec} freezeDatetime onSave={this.saveEdit.bind(this)} onCancel={this.cancelEdit.bind(this)} />);
        } else {
          return (<ElectricityItem key={elec.timestamp} {...elec} onEdit={() => { this.onEdit(elec.timestamp); }} onDelete={() => { this.deleteItem(elec.timestamp); }}/>);
        }
      });
    } else {
      body = (
        <TableRow>
          <TableRowColumn>Empty list</TableRowColumn>
        </TableRow>
      );
    }

    if (this.state.edit === false) {
      footer = (
        <TableRow>
            <TableRowColumn>
              <RaisedButton label="New" secondary onClick={this.onNew.bind(this)} />
            </TableRowColumn>
          </TableRow>
      );
    } else if (this.state.edit === true) {
      footer = (
        <ElectricityItemEdit onSave={this.saveEdit.bind(this)} onCancel={this.cancelEdit.bind(this)}/>
      );
    }

    return (
      <Table selectable={false} height="300px">
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn>Datetime</TableHeaderColumn>
            <TableHeaderColumn>High cost</TableHeaderColumn>
            <TableHeaderColumn>Low cost</TableHeaderColumn>
            <TableHeaderColumn />
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {body}
          {/* Add row for the New button */}
          {footer}
        </TableBody>
      </Table>
    );
  }
}
