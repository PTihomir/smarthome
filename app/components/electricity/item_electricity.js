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
    const cellStyle = {
      height: undefined,
    };

    return (
      <TableRow style={{height: undefined}}>
        <TableRowColumn style={cellStyle}>{moment(this.props.timestamp).format('YYYY-MM-DD')}</TableRowColumn>
        <TableRowColumn style={cellStyle}>{this.props.high_cost || 0}</TableRowColumn>
        <TableRowColumn style={cellStyle}>{this.props.low_cost || 0}</TableRowColumn>
        <TableRowColumn style={cellStyle}>
          { this.props.onEdit ? (<IconButton iconStyle={{width: '16px', height: '16px'}} onClick={this.props.onEdit}><FontIcon style={{fontSize: 48}} className="material-icons">create</FontIcon></IconButton>) : ''}
          { this.props.onEdit ? (<IconButton onClick={this.props.onDelete}><FontIcon style={{fontSize: 16}} className="material-icons">delete</FontIcon></IconButton>) : ''}
        </TableRowColumn>
      </TableRow>
    );
  }

}
