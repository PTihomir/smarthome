import React, {Component, PropTypes} from 'react';
import moment from 'moment';
import d3 from 'd3';
import { StyleSheet } from 'react-look';
import Axis from './Axis';
import Plot from './Plot';
import Tooltip from './Tooltip';
// import { getTicks } from './helper';

const defaultChartColors = ['#009688', '#2196F3', '#E91E63', '#F44336'];

// function range(start, end) {
//   return Array(end - start).fill().map((x, i) => start + i);
// }

export default class BarChart extends Component {
  static propTypes = {
    data: PropTypes.array,
    lineData: PropTypes.array,
    stacked: PropTypes.bool,
    margin: PropTypes.object,
  };

  static defaultProps = {
    stacked: true,
    width: 500,
    height: 300,
    margin: { top: 10, right: 10, bottom: 40, left: 60 },
    // data: [
    //   { name: 'Series 0',
    //     values:[[0, 10], [1, 8], [2, 12], [3, 1], [4, 7], [5, 7], [7, 11],
    //     [8, 11], [9, 3], [10, 4], [11, 5], [12, 6], [13, 7], [14, 8]] },
    //   { name: 'Series 1',
    //     values:[[0, 1], [1, 2], [2, 3], [3, 0], [4, 1], [5, 2], [7, 3],
    //     [8, 0], [9, 1], [10, 2], [11, 3], [12, 0], [13, 0], [14, 1]] },
    //   { name: 'Series 2',
    //     values:[[0, 4], [1, 5], [2, 0], [3, 3], [4, 4], [5, 0], [7, 2],
    //     [8, 3], [9, 0], [10, 1], [11, 2], [12, 0], [13, 1], [14, 0]] },
    // ],
    // lineData: [{
    //   name: 'Series 0',
    //   values:[[0, 10], [1, 8], [2, 12], [3, 1], [4, 7], [5, 7], [7, 11],
    //   [8, 11], [9, 3], [10, 4], [11, 5], [12, 6], [13, 7], [14, 8]],
    // }, {
    //   name: 'Series 1',
    //   values:[[0, 2], [1, 8], [2, 3], [3, 7], [4, 4], [5, 6], [7, 5],
    //   [8, 5], [9, 4], [10, 6], [11, 3], [12, 7], [13, 2], [14, 8]],
    // }],
  };

  state = {
    width: null,
    height: null,
    scaleX: d3.scale
        .linear(),
    scaleY: d3.scale
        .linear(),
  };

  constructor(props) {
    super(props);
    this.updateWidth = this.updateWidth.bind(this);
  }

  // componentWillMount() {
  //   this.processSeries(this.props.data, this.props.lineData);
  // }

  componentDidMount() {
    this.cachedWidth = -1;
    this.cachedHeight = -1;

    // Set the interval for checking width and height
    this.interval = setInterval(() => {
      // console.log('ping interval');
      const newWidth = this.refs.graphCont.offsetWidth;
      const newHeight = this.refs.graphCont.offsetHeight;
      if (this.cachedWidth !== newWidth || this.cachedHeight !== newHeight) {
        this.cachedWidth = newWidth;
        this.cachedHeight = newHeight;
        this.updateWidth(newWidth, newHeight);
      }
    }, 100);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentWillReceiveProps(nextProps) {
    this.processSeries(nextProps.data, nextProps.lineData);
  }

  updateWidth(newWidth, newHeight) {
    const scaleX = this.state.scaleX.copy();
    const scaleY = this.state.scaleY.copy();

    scaleX.range([0, newWidth - this.props.margin.left - this.props.margin.right]);
    scaleY.range([0, newHeight - this.props.margin.bottom - this.props.margin.top]);

    this.setState({
      width: newWidth,
      height: newHeight,
      scaleX: scaleX,
      scaleY: scaleY,
    });

    this.processSeries(this.props.data, this.props.lineData);
  }

  processSeries(barSeries, lineSeries) {
    let groupedValues = {};
    let lineValues = [];
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    // go over bar chart data
    barSeries.forEach(({values, ...seriesInfo}, idx) => {
      seriesInfo.color = seriesInfo.color || defaultChartColors[idx % 4];

      values.forEach((point) => {
        let x, y;
        if (!point.length) {
          x = point.x;
          y = point.y;
        } else {
          x = point[0];
          y = point[1];
        }

        if (x < minX) { minX = x; }
        if (x > maxX) { maxX = x; }
        if (y < minY) { minY = y; }
        if (y > maxY) { maxY = y; }

        if (!groupedValues[x]) {
          groupedValues[x] = [];
        }

        groupedValues[x].push({
          y,
          point,
          series: seriesInfo,
        });
      });
    });

    // Make array from object.
    groupedValues = Object.keys(groupedValues).map((key) => {
      // If stacked, then check for cumultativ value, would it exceed maxY.
      if (this.props.stacked) {
        const sumY = groupedValues[key].reduce((value, point) => value + point.y, 0);
        if (sumY > maxY) { maxY = sumY; }
      }

      return {
        x: key,
        values: groupedValues[key],
      };
    });

    if (lineSeries) {
      // go over line chart data
      lineValues = lineSeries.map(({values, ...seriesInfo}, idx) => {
        seriesInfo.color = seriesInfo.color || defaultChartColors[idx % 4];

        const processedValues = values.map((point) => {
          let x, y;
          if (!point.length) {
            x = point.x;
            y = point.y;
          } else {
            x = point[0];
            y = point[1];
          }

          if (x < minX) { minX = x; }
          if (x > maxX) { maxX = x; }
          if (y < minY) { minY = y; }
          if (y > maxY) { maxY = y; }

          return {
            x,
            y,
            point,
            series: seriesInfo,
          };
        });

        return {
          ...seriesInfo,
          values: processedValues,
        };
      });
    }

    if (groupedValues.length === 0 && lineValues.length === 0) {
      return;
    }

    const scaleX = this.state.scaleX;
    const scaleY = this.state.scaleY;

    scaleY.domain([minY, maxY]);
    scaleY.nice(5);

    const verticalTicks = scaleY.ticks(5);

    const horizontalTicks = [];
    let month = moment(minX).startOf('month');
    let i = 0;
    while (month.isBefore(maxX) && i < 10) {
      horizontalTicks.push(month.valueOf());
      month.add(1, 'month');
      i++;
    }
    horizontalTicks.push(month.valueOf());

    scaleX.domain([horizontalTicks[0] - 12 * 24 * 60 * 60 * 1000, horizontalTicks[horizontalTicks.length - 1] + 12 * 24 * 60 * 60 * 1000]);

    this.setState({
      values: groupedValues,
      lineValues,
      xDomain: [minX, maxX],
      minX,
      minY,
      maxX,
      maxY,
      scaleX,
      scaleY,
      verticalTicks,
      horizontalTicks,
    });
  }

  handleHover(x, y, index) {
    const points = this.state.values[index];

    const tooltip = (
      <table>
        <caption>{ moment(parseInt(points.x, 10)).format('YYYY MMM')}</caption>
        <tbody>
        { points.values.map((point, idx) => {
          return (
            <tr key={point.series.name}>
              <td className={style.tooltip__row__name} key="name">
                {`${point.series.name}`}
              </td>
              <td key="value">
                {`${Math.round(point.y)} kWh`}
              </td>
            </tr>);
        })
        }
        </tbody>
      </table>
    );

    this.setState({
      tooltip: tooltip,
      tooltipVisible: true,
    });
  }

  handleHoverEnd() {
    this.setState({
      tooltipVisible: false,
    });
  }

  renderSVG() {
    if (this.state.width !== null && this.state.height !== null) {
      const margin = this.props.margin;
      const innerWidth = this.state.width - margin.left - margin.right;
      const innerHeight = this.state.height - margin.top - margin.bottom;

      return (
        <svg height={this.state.height} width={this.state.width}>
          {/* Center area */}
          <g transform={`translate(${margin.left}, ${margin.top})`}>
            <Plot height={innerHeight}
              xDomain={this.state.xDomain}
              width={innerWidth}
              data={this.state.values}
              lineData={this.state.lineValues}
              scaleX={this.state.scaleX}
              scaleY={this.state.scaleY}
              stacked={this.props.stacked}
              horizontalGuidlines={this.state.verticalTicks}
              onEnterPoint={this.handleHover.bind(this)}
              onLeavePoint={this.handleHoverEnd.bind(this)}
              />
          </g>
          {/* Left */}
          <g transform={`translate(0, ${margin.top})`}>
            <Axis
              height={innerHeight}
              width={margin.left}
              position="left"
              ticks={this.state.verticalTicks}
              tickFormat={(x) => `${x} kWh`}
              scale={this.state.scaleY}
              />
          </g>
          {/* Bottom */}
          <g transform={`translate(${margin.left}, ${this.state.height - margin.bottom})`}>
            <Axis
              height={margin.bottom}
              width={innerWidth}
              position="bottom"
              type="datetime"
              label="Month"
              ticks={this.state.horizontalTicks}
              scale={this.state.scaleX}
              />
          </g>
          {/* Right */}
          <g transform={`translate(${this.state.width - margin.right}, ${margin.top})`}>
          </g>
          {/* Top */}
          <g transform={`translate(${margin.left}, 0)`}>
          </g>
        </svg>
        );
    }
  }

  render() {
    const svg = this.renderSVG();

    return (
      <div ref="graphCont" className={style.chart}>
        {svg}
        {/* Tooltip*/}
        <Tooltip
          height={this.state.width}
          width={this.state.height}
          show={this.state.tooltipVisible}>
          {this.state.tooltip}
        </Tooltip>
      </div>);
  }
}

const style = StyleSheet.create({
  chart: {
    display: 'relative',
    width: '100%',
    height: '100%',
  },

  tooltip__row__name: {
    paddingRight: 16,
  },
});
