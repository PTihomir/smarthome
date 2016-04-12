import React, {Component, PropTypes} from 'react';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import TimePicker from 'material-ui/lib/time-picker/time-picker';
import moment from 'moment';
import classNames from 'classnames/bind';

import RaisedButton from 'material-ui/lib/raised-button';

import TextField from 'material-ui/lib/text-field';

import classes from './electricity.scss';

const cx = classNames.bind(classes);

export default class ElectricityItemEdit extends Component {
  static propTypes = {
    timestamp: PropTypes.number,
    high_cost: PropTypes.number,
    low_cost: PropTypes.number,
    // min_high: PropTypes.number,
    // min_low: PropTypes.number,
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
    freezeDatetime: false,
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

  constructor(props) {
    super(props);

    this.onDateChange = this.onDateChange.bind(this);
    this.onTimeChange = this.onTimeChange.bind(this);
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

  renderDateTime() {
    if (this.props.freezeDatetime) {
      return (`Edit item for date ${moment(this.state.timestamp).format('YYYY-MM-DD HH:mm')}`);
    } else {
      return [
        <DatePicker
          key="date"
          textFieldStyle={{width: 'auto'}}
          value={new Date(this.state.timestamp)}
          // hintText={moment(this.state.timestamp).format('YYYY-MM-DD')}
          formatDate={value => moment(value).format('YYYY-MM-DD')}
          onChange={this.onDateChange.bind(this)}
          autoOk
        />,
        <TimePicker
          key="time"
          textFieldStyle={{width: 'auto'}}
          defaultTime={new Date(this.state.timestamp)}
          format="24hr"
          onChange={this.onTimeChange.bind(this)}
          autoOk />,
      ];
    }
  }

  render() {
    return (
      <div className={cx('edit-form')}>
          <div className={cx('edit-form__datetime')}>
            {this.renderDateTime()}
          </div>
          <div className={cx('edit-form__inputs')}>
            <TextField type="text" hintText="High cost usage"
              style={{width: 'auto'}}
              value={this.state.high_cost}
              onChange={this.onHighcostChange.bind(this)}
              floatingLabelText="High cost"/>
            <TextField type="text" hintText="Low cost usage"
              style={{width: 'auto'}}
              value={this.state.low_cost}
              onChange={this.onLowcostChange.bind(this)}
              floatingLabelText="Low cost"/>
          </div>
          <div className={cx('edit-form__buttons')}>
            <RaisedButton label="Save" primary style={{marginRight: '12px'}} onClick={this.save.bind(this)}/>
            <RaisedButton label="Cancel" style={{}} onClick={this.cancel.bind(this)}/>
          </div>
      </div>
    );
  }

}
