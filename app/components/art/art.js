import React, {Component, PropTypes} from 'react';

export default class Art extends Component {

  static propTypes = {
    size: PropTypes.number,
    fill: PropTypes.string,
    counter: PropTypes.number,
    animationSpeed: PropTypes.number,
    speed1: PropTypes.number,
    speed2: PropTypes.number,
    offset1: PropTypes.number,
    offset2: PropTypes.number,
    radius1: PropTypes.number,
    radius2: PropTypes.number,
    onFinished: PropTypes.func,
  };

  static defaultProps = {
    size: 512,
    fill: 'currentcolor',
    counter: 1000,
    animationSpeed: 10,
    speed1: 9,
    speed2: 6,
    offset1: 0,
    offset2: 0,
    radius1: 110,
    radius2: 240,
    onFinished: () => {},
  };

  state = {
    path: [],
  };

  componentDidMount () {
    this.resetAnimation();
  }

  componentDidUpdate (prevProps) {
    if (prevProps.size !== this.props.size ||
        prevProps.fill !== this.props.fill ||
        prevProps.animationSpeed !== this.props.animationSpeed ||
        prevProps.speed1 !== this.props.speed1 ||
        prevProps.offset1 !== this.props.offset1 ||
        prevProps.radius1 !== this.props.radius1 ||
        prevProps.speed2 !== this.props.speed2 ||
        prevProps.offset2 !== this.props.offset2 ||
        prevProps.radius2 !== this.props.radius2 ||
        prevProps.onFinished !== this.props.onFinished) {
      this.resetAnimation();
    }
  }

  resetAnimation () {
    const animationSpeed = this.props.animationSpeed;
    this.counter = 0;

    clearTimeout(this.timeoutId);

    console.log(animationSpeed);

    if (!animationSpeed || isNaN(animationSpeed)) {
      let path = [];

      for (this.counter = 0; this.counter <= this.props.counter && !this.checkRepetation(path); this.counter++) {
        const {start, end} = this.drawSegment(this.counter);
        path.push(`M${Math.round(start.x)},${Math.round(start.y)}L${Math.round(end.x)},${Math.round(end.y)}`);
      }

      this.setState({
        path: path,
      });
      this.props.onFinished(this.counter);
    } else {
      this.setState({
        path: [],
      });

      this.timeoutId = setInterval(() => {
        const {start, end} = this.drawSegment(this.counter);
        this.setState({
          path: [...this.state.path, `M${Math.round(start.x)},${Math.round(start.y)}L${Math.round(end.x)},${Math.round(end.y)}`],
        });

        this.counter = this.counter + 1;

        if (this.counter >= this.props.counter || this.checkRepetation(this.state.path)) {
          clearTimeout(this.timeoutId);
          this.props.onFinished(this.counter);
        }
      }, animationSpeed);
    }
  }

  checkRepetation (path) {
    if (path.length > 2 && path[0] === path[path.length - 1]) {
      return true;
    }

    return false;
  }

  rad (degree) {
    return Math.PI * degree / 180;
  }

  drawSegment (index) {
    const centerPoint = this.props.size / 2;
    const angle1 = index * this.rad(this.props.speed1) + this.rad(this.props.offset1);
    const angle2 = index * this.rad(this.props.speed2) + this.rad(this.props.offset2);

    let start = {};
    let end = {};

    start.x = centerPoint + Math.cos(angle1) * this.props.radius1;
    start.y = centerPoint + Math.sin(angle1) * this.props.radius1;
    end.x = centerPoint + Math.cos(angle2) * this.props.radius2;
    end.y = centerPoint + Math.sin(angle2) * this.props.radius2;

    return { start, end };
  }

  render () {
    const size = this.props.size;
    const fill = this.props.fill;

    const viewBox = [0, 0, size, size].join(' ');

    const pathData = this.state.path.join(' ');

    return (
      <svg xmlns="http://www.w3.org/svg/2000"
        viewBox={viewBox}
        width={size}
        height={size}
        fill={fill}
        onClick={this.resetAnimation.bind(this)}>
        <path
          stroke="#F00"
          d={pathData} />
      </svg>
    );
  }
}
