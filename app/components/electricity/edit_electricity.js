import React, {Component, PropTypes} from 'react';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import TimePicker from 'material-ui/lib/time-picker/time-picker';
import moment from 'moment';

import TableRow from 'material-ui/lib/table/table-row';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import IconButton from 'material-ui/lib/icon-button';
import FontIcon from 'material-ui/lib/font-icon';
import TextField from 'material-ui/lib/text-field';

export default class ElectricityItemEdit extends Component {
  static propTypes = {
    timestamp: PropTypes.number,
    high_cost: PropTypes.number,
    low_cost: PropTypes.number,
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    freezeDatetime: PropTypes.bool,
  };

  static defaultProps = {
    timestamp: moment().valueOf(),
    high_cost: 0,
    low_cost: 0,
    onSave: () => {},
    onCancel: () => {},
  };

  state = {
    timestamp: this.props.timestamp,
    high_cost: this.props.high_cost,
    low_cost: this.props.low_cost,
  };

  save() {
    this.props.onSave({
      timestamp: this.state.timestamp,
      high_cost: this.state.high_cost,
      low_cost: this.state.low_cost,
    });
  }

  cancel() {
    this.props.onCancel();
  }

  onDateChange(e, newDate) {
    const date = moment(newDate);
    const value = moment(this.state.timestamp)
      .year(date.year())
      .month(date.month())
      .date(date.date())
      .valueOf();

    this.setState({
      timestamp: value,
    });
  }

  onTimeChange(e, newDate) {
    const date = moment(newDate);
    const value = moment(this.state.timestamp)
      .hour(date.hour())
      .minute(date.minute())
      .valueOf();

    this.setState({
      timestamp: value,
    });
  }

  onHighcostChange(e) {
    const num = parseInt(e.target.value, 10);
    if (isNaN(num) && e.target.value !== '') {

    } else {
      this.setState({
        high_cost: e.target.value === '' ? '' : num,
      });
    }
  }

  onLowcostChange(e) {
    const num = parseInt(e.target.value, 10);
    if (isNaN(num) && e.target.value !== '') {

    } else {
      this.setState({
        low_cost: e.target.value === '' ? '' : num,
      });
    }
  }

  render() {
    return (
      <TableRow>
          <TableRowColumn>
            { this.props.freezeDatetime ? moment(this.state.timestamp).format('YYYY-MM-DD HH:mm')
            : [
              <DatePicker
                key="date"
                value={new Date(this.state.timestamp)}
                // hintText={moment(this.state.timestamp).format('YYYY-MM-DD')}
                formatDate={value => moment(value).format('YYYY-MM-DD')}
                onChange={this.onDateChange.bind(this)}
                autoOk
              />,
              <TimePicker
                key="time"
                defaultTime={new Date(this.state.timestamp)}
                format="24hr"
                onChange={this.onTimeChange.bind(this)}
                autoOk />,
            ]
          }
          </TableRowColumn>
          <TableRowColumn><TextField type="number" style={{width: '100px'}} hintText="High cost usage" value={this.state.high_cost} onChange={this.onHighcostChange.bind(this)}/>{' '}kWh</TableRowColumn>
          <TableRowColumn><span style={{position: 'inline-block'}}><TextField style={{width: '100px'}} hintText="Low cost usage" value={this.state.low_cost} onChange={this.onLowcostChange.bind(this)}/></span>{' '}kWh</TableRowColumn>
          <TableRowColumn>
            <IconButton onClick={this.save.bind(this)}><FontIcon className="material-icons">done</FontIcon></IconButton>
            <IconButton onClick={this.cancel.bind(this)}><FontIcon className="material-icons">clear</FontIcon></IconButton>
          </TableRowColumn>
      </TableRow>
    );
  }

}
