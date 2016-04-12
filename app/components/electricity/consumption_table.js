'use strict';
import React, {Component, PropTypes} from 'react';
import moment from 'moment';

import classes from './electricity.scss';

import classNames from 'classnames/bind';

import { AutoSizer, FlexTable, FlexColumn } from 'react-virtualized';
import 'react-virtualized/styles.css';

let cx = classNames.bind(classes);

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

    const powerCellRenderer = (cellData) => cellData ? `${Math.round(cellData)}kWh` : '-';

    let headerHeight = 40;
    let rowHeight = 30;
    let datetimeColumnWidth = 130;

    if (matchMedia('only screen and (max-width: 480px)').matches) {
      headerHeight = 30;
      rowHeight = 20;
      datetimeColumnWidth = 100;
    }

    return (
        <AutoSizer>
        {({ height, width }) => (
          <FlexTable
            width={width}
            height={height}
            headerHeight={headerHeight}
            rowClassName={cx('FlexTable__row')}
            rowHeight={rowHeight}
            rowGetter={(index) => list[index]}
            rowsCount={list.length}
          >
            <FlexColumn
              label="Month"
              dataKey="timestamp"
              flexShrink={0}
              flexGrow={1}
              width={datetimeColumnWidth}
              cellRenderer={(cellData) => `${moment(cellData).format('YYYY MMM')}`}
            />
            <FlexColumn
              label="Day"
              dataKey="day"
              flexGrow={1}
              width={90}
              cellRenderer={powerCellRenderer}
            />
            <FlexColumn
              label="Night"
              dataKey="night"
              flexGrow={1}
              width={90}
              cellRenderer={powerCellRenderer}
            />
            <FlexColumn
              label="Sum"
              dataKey="sum"
              flexGrow={1}
              width={90}
              cellDataGetter={(dataKey, rowData) => Math.round(rowData.night + rowData.day)}
              cellRenderer={powerCellRenderer}
            />
          </FlexTable>)}
        </AutoSizer>
    );
  }
}
