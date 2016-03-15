'use strict';
import React, {Component, PropTypes} from 'react';
import ElectricityItem from './item_electricity';
import ElectricityItemEdit from './edit_electricity';

import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRow from 'material-ui/lib/table/table-row';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';

export default class ElectricityTable extends Component {

  static propTypes = {
    list: PropTypes.array,
    showNewForm: PropTypes.bool,
    editItem: PropTypes.any,
    onSave: PropTypes.func,
    onDelete: PropTypes.func,
    onEditItem: PropTypes.func,
    onCancel: PropTypes.func,
  };

  static defaultProps = {
    list: [],
  };

  constructor() {
    super();
    this.onEdit = this.onEdit.bind(this);
    this.saveEdit = this.saveEdit.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

  onEdit(id) {
    this.props.onEditItem(id);
  }

  saveEdit(data) {
    this.props.onSave(data);
  }

  cancelEdit() {
    this.props.onCancel();
  }

  deleteItem(timestamp) {
    this.props.onDelete({
      timestamp: timestamp,
    });
  }

  render() {
    const list = this.props.list;

    let body;
    let newForm;

    if (list.length > 0) {
      body = list.map((elec, idx) => {
        if (elec.timestamp === this.props.editItem) {
          return (<ElectricityItemEdit key={elec.timestamp} {...elec}
            freezeDatetime
            onSave={this.saveEdit}
            onCancel={this.cancelEdit} />);
        } else {
          return (<ElectricityItem key={elec.timestamp} {...elec}
            onEdit={() => { this.onEdit(elec.timestamp); }}
            onDelete={() => { this.deleteItem(elec.timestamp); }}/>);
        }
      });
    } else {
      body = (
        <TableRow>
          <TableRowColumn>Empty list</TableRowColumn>
        </TableRow>
      );
    }

    if (this.props.showNewForm) {
      newForm = (
        <ElectricityItemEdit onSave={this.saveEdit} onCancel={this.cancelEdit}/>
      );
    }

    return (
      <Table selectable={false} height="200px">
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn>Datetime</TableHeaderColumn>
            <TableHeaderColumn>High cost</TableHeaderColumn>
            <TableHeaderColumn>Low cost</TableHeaderColumn>
            <TableHeaderColumn />
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {/* Add row for the New button */}
          {newForm}
          {body}
        </TableBody>
      </Table>
    );
  }
}
