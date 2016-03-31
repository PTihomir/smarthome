'use strict';
import moment from 'moment';
import classNames from 'classnames/bind';
import React, {Component, PropTypes} from 'react';

import classes from './electricity.scss';
import variables from '../../style/variables';

// import Tile from './tile.js';

let cx = classNames.bind(classes);

// export const dimension = {
//   width: 1,
//   height: 1,
//   expWidth: 3,
//   expHeight: 3,
// };

export default class ElectricityPanelCompact extends Component {
  static propTypes = {
    data: PropTypes.object,
  };

  static defaultProps = {
    data: null,
  };

  state = {
  };

  render() {
    const data = this.props.data;
    if (!data) {
      return (<div>No data defined</div>);
    }

    const day = Math.round(data.day);
    const night = Math.round(data.night);

    return (
      <div className={cx('panel')}>
        <h3 className={cx('panel__title')}>{moment(data.timestamp).format('YYYY MMM')}</h3>
        <div
          className={cx('panel__value')}
          style={{backgroundColor: variables.colors.dayEnergy}}>
            {day ? `${day} kWh` : '-'}
        </div>
        <div
          className={cx('panel__value')}
          style={{backgroundColor: variables.colors.nightEnergy}}>
            {night ? `${night} kWh` : '-'}
        </div>
      </div>
    );
  }
}
