'use strict';
import React, {Component} from 'react';
import request from 'superagent';
import BarChart from '../../components/graph/BarChart';

import ElectricityList from './list';

export default class ElectricityPanel extends Component {
  static propTypes = {
  };

  state = {
    list_raw: [],
    list_cons: [],
  };

  componentDidMount() {
    this.fetchListData();
  }

  fetchListData() {
    // request
    //   .post('http://localhost:4080/electricity/list')
    //   .accept('application/json')
    //   .end((err, res) => {
    //     if (err || !res.ok) {
    //       alert('Oh no! error');
    //     } else {
    //       // console.log(res.body);
    //       this.setState({
    //         list_raw: res.body.list_raw,
    //         list_cons: res.body.list_cons,
    //       });
    //     }
    //   });
  }

  saveEdit(data) {
    request
      .post('http://localhost:4080/electricity/save')
      .accept('application/json')
      .send(JSON.stringify(data))
      .end((err, res) => {
        if (err || !res.ok) {
          alert('Oh no! error');
        } else {
          // console.log(res.body);
          this.fetchListData();
        }
      });
  }

  deleteItem(data) {
    request
      .post('http://localhost:4080/electricity/delete')
      .accept('application/json')
      .send(JSON.stringify(data))
      .end((err, res) => {
        if (err || !res.ok) {
          alert('Oh no! error');
        } else {
          // console.log(res.body);
          this.fetchListData();
        }
      });
  }

  render() {
    const list_raw = this.state.list_raw;
    const list_cons = this.state.list_cons;

    const scale = 700.0 / list_cons.length;

    const graph_data = [{
      name: 'Day cons',
      values: list_cons.map((item, idx) => {
        return {
          x: item.timestamp,
          y: item.day,
        };
      }),
    }, {
      name: 'Night cons',
      values: list_cons.map((item, idx) => {
        return {
          x: item.timestamp,
          y: item.night,
        };
      }),
    }];

    return (
      <div>
        <div className="graph">
          <BarChart
            width={700}
            height={200}
          />
        </div>
        <ElectricityList list_raw={list_raw} list_cons={list_cons} onSave={this.saveEdit.bind(this)} onDelete={this.deleteItem.bind(this)} />
      </div>
    );
  }
}
