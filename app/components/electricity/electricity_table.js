'use strict';
import React, {Component, PropTypes} from 'react';
import moment from 'moment';

// import classes from './electricity.scss';

// import classNames from 'classnames/bind';

// import ElectricityItem from './item_electricity';
// import ElectricityItemEdit from './edit_electricity';

import { AutoSizer, FlexTable, FlexColumn } from 'react-virtualized';
import 'react-virtualized/styles.css';

import IconButton from 'material-ui/lib/icon-button';
import FontIcon from 'material-ui/lib/font-icon';

// let cx = classNames.bind(classes);

export default class ElectricityTable extends Component {

  static propTypes = {
    list: PropTypes.array,
    onDeleteItem: PropTypes.func,
    onEditItem: PropTypes.func,
  };

  static defaultProps = {
    list: [],
  };

  constructor(props) {
    super(props);
    // this.onEdit = this.onEdit.bind(this);
    // this.deleteItem = this.deleteItem.bind(this);
  }

  onEdit(timestamp) {
    this.props.onEditItem(timestamp);
  }

  deleteItem(timestamp) {
    this.props.onDeleteItem({
      timestamp: timestamp,
    });
  }

  renderButtons(cellData, cellDataKey, rowData) {
    return (
      <div>
        <IconButton style={{width: '36px', height: '30px', padding: '3px 6px'}}
          onClick={() => { this.onEdit(rowData.timestamp); }}>
          <FontIcon className="material-icons">create</FontIcon>
        </IconButton>
        <IconButton style={{width: '36px', height: '30px', padding: '3px 6px'}}
          onClick={() => { this.deleteItem(rowData.timestamp); }}>
          <FontIcon className="material-icons">delete</FontIcon>
        </IconButton>
      </div>
    );
  }

  render() {
    const list = this.props.list;
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
            rowHeight={rowHeight}
            rowGetter={(index) => list[index]}
            rowsCount={list.length}
          >
            <FlexColumn
              label="Datetime"
              dataKey="timestamp"
              flexShrink={0}
              flexGrow={1}
              width={datetimeColumnWidth}
              cellRenderer={(cellData) => `${moment(cellData).format('YYYY/MM/D H')}h`}
            />
            <FlexColumn
              label="High cost"
              dataKey="high_cost"
              flexGrow={1}
              width={90}
              cellRenderer={(cellData) => `${cellData}kWh`}
            />
            <FlexColumn
              label="Low cost"
              dataKey="low_cost"
              flexGrow={1}
              width={90}
              cellRenderer={(cellData) => `${cellData}kWh`}
            />
            <FlexColumn
              label=""
              dataKey="actions"
              flexGrow={0}
              flexShrink={0}
              width={80}
              cellDataGetter={(dataKey, rowData) => ''}
              cellRenderer={this.renderButtons.bind(this)}
            />
          </FlexTable>)}
        </AutoSizer>
    );
  }
}
