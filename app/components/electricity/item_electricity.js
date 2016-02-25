import React, {Component, PropTypes} from 'react';
import moment from 'moment';

import TableRow from 'material-ui/lib/table/table-row';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import IconButton from 'material-ui/lib/icon-button';
import FontIcon from 'material-ui/lib/font-icon';

export default class ElectricityItem extends Component {
  static propTypes = {
    timestamp: PropTypes.number.isRequired,
    high_cost: PropTypes.number,
    low_cost: PropTypes.number,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
  };

  render() {
    return (
      <TableRow>
        <TableRowColumn>{moment(this.props.timestamp).format('YYYY-MM-DD')}</TableRowColumn>
        <TableRowColumn>{this.props.high_cost || 0}</TableRowColumn>
        <TableRowColumn>{this.props.low_cost || 0}</TableRowColumn>
        <TableRowColumn>
          { this.props.onEdit ? (<IconButton onClick={this.props.onEdit}><FontIcon className="material-icons">create</FontIcon></IconButton>) : ''}
          { this.props.onEdit ? (<IconButton onClick={this.props.onDelete}><FontIcon className="material-icons">delete</FontIcon></IconButton>) : ''}
        </TableRowColumn>
      </TableRow>
    );
  }

}
