import React, {Component, PropTypes} from 'react';
import BarGroup from './BarGroup';
import Path from './Path';

export default class Plot extends Component {
  static propTypes = {
    boundaries: PropTypes.object,
    width: PropTypes.number,
    height: PropTypes.number,
    data: PropTypes.array.isRequired,
    xDomain: PropTypes.array,
    lineData: PropTypes.array.isRequired,
    scaleX: PropTypes.func,
    scaleY: PropTypes.func, // []
    stacked: PropTypes.bool.isRequired,
    verticalGuidlines: PropTypes.array,
    horizontalGuidlines: PropTypes.array,
    onEnterPoint: PropTypes.func,
    onLeavePoint: PropTypes.func,
    onEnterPlot: PropTypes.func,
    onLeavePlot: PropTypes.func,
  };

  static defaultProps = {
    width: 500,
    height: 300,
    verticalGuidlines: [],
    horizontalGuidlines: [],
  };

  render() {
    let translate;

    const barGroupWidth = this.props.width / (this.props.xDomain[1] - this.props.xDomain[0] + 1);

    const lines = this.props.lineData.map((series, idx) => {
      const values = series.values.map(point => [this.props.scaleX(point.x), this.props.scaleY(point.y)]);
      return (<Path key={idx}
        values={values}
        color={series.color}
        />);
    });

    const barGroups = this.props.data.map((a, idx) => {
      const values = a.values.map((point) => ({ color: point.series.color, height: this.props.scaleY(point.y) }));
      return (
        <BarGroup key={idx}
          dataIndex={idx}
          width={barGroupWidth}
          height={this.props.height}
          leftOffset={barGroupWidth * a.x}
          values={values}
          stacked={this.props.stacked}
          onEnter={this.props.onEnterPoint}
          onLeave={this.props.onLeavePoint}
        />);
    });

    const vertGuides = this.props.verticalGuidlines.map((pos, idx) => {
      const x = this.props.scaleX(pos);
      return (
        <line key={idx}
          x1={x}
          x2={x}
          y1={0}
          y2={this.props.height}
          style={{stroke: '#CCC', strokeWidth: 0.5}}
        />);
    });

    const horGuides = this.props.horizontalGuidlines.map((pos, idx) => {
      const y = this.props.scaleY(pos);
      return (
        <line key={idx}
          x1={0}
          x2={this.props.width}
          y1={y}
          y2={y}
          style={{stroke: '#CCC', strokeWidth: 1}}
        />);
    });

    return (
      <g transform={translate}
        onMouseEnter={this.props.onEnterPlot}
        onMouseLeave={this.props.onLeavePlot}>
        {horGuides}
        {vertGuides}
        {barGroups}
        {lines}
      </g>
    );
  }
}
