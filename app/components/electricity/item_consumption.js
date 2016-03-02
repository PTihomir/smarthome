import React, {Component, PropTypes} from 'react';
import moment from 'moment';

import TableRow from 'material-ui/lib/table/table-row';
import TableRowColumn from 'material-ui/lib/table/table-row-column';

export default class ElectricityConsumptionItem extends Component {

  static propTypes = {
    timestamp: PropTypes.number.isRequired,
    day: PropTypes.number,
    night: PropTypes.number,
  };

  render() {
    const day = Math.round(this.props.day);
    const night = Math.round(this.props.night);
    const sum = Math.round(this.props.day + this.props.night);
    const cellStyle = {
      height: undefined,
    };

    return (
      <TableRow style={{height: undefined}}>
        <TableRowColumn style={cellStyle}>{moment(this.props.timestamp).format('YYYY MMM')}</TableRowColumn>
        <TableRowColumn style={cellStyle}>{day ? `${day} kWh` : '-'}</TableRowColumn>
        <TableRowColumn style={cellStyle}>{night ? `${night} kWh` : '-'}</TableRowColumn>
        <TableRowColumn style={cellStyle}>{sum ? `${sum} kWh` : '-'}</TableRowColumn>
      </TableRow>
    );
  }
}
