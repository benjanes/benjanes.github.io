import React, { Component } from 'react';
import { Triangle, drawTriangles } from '../../../utils/triangleUtils.js';

export default class ScrollProgressBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ctx: null,
      canvasHeight: 0,
      scrollableHeight: null,
      d: 0,
      triangles: []
    };

    // this.handleScroll = this.handleScroll.bind(this);
    // this.animateProgressBar = this.animateProgressBar.bind(this);
  }

  componentDidMount() {
    console.log('bar did mount');
    setTimeout(this.initializeProgressBar.bind(this), 50);
    // this.initializeProgressBar();

    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  initializeProgressBar() {
    let ctx = this.$canvas.getContext('2d');
    let canvasHeight = window.innerHeight;
    let documentHeight = document.body.offsetHeight;
    let scrollableHeight = documentHeight - canvasHeight;
    // console.log(documentHeight);
    let d = canvasHeight / (this.props.maxRows - 1);

    this.setState({
      ctx,
      canvasHeight,
      scrollableHeight,
      d
    }, () => {
      this.animateProgressBar();
      // console.log(this.state.scrollableHeight);
    });
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll.bind(this));
    cancelAnimationFrame(this.rAF);
  }

  addTriangle(rowIdx) {
    const triangles = this.state.triangles;
    triangles[triangles.length] = new Triangle(rowIdx, this.state.d);
  }

  handleScroll(e) {
    const triangles = this.state.triangles;
    const scrollPos = window.scrollY;
    const scrollProportion = scrollPos / this.state.scrollableHeight;
    const numRows = Math.ceil(scrollProportion * this.props.maxRows);

    if (triangles.length > numRows) {
      for (let i = triangles.length; i > numRows; i--) {
        triangles.pop();
      }
    } else if (triangles.length < numRows) {
      for (let i = triangles.length; i < numRows; i++) {
        this.addTriangle(i);
      }
    }
  }

  animateProgressBar() {
    // const animateProgressBar = this.animateProgressBar;
    const ctx = this.state.ctx;
    const triangles = this.state.triangles;
    const d = this.state.d;

    ctx.clearRect(0, 0, this.$canvas.width, this.$canvas.height);
    drawTriangles(triangles, ctx, d);

    this.rAF = requestAnimFrame(this.animateProgressBar.bind(this));
  }

  render() {
    return (
      <canvas
        ref={ canvas => this.$canvas = canvas }
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
        }}
        width={ this.state.d }
        height={ this.state.canvasHeight }
        onScroll={ this.doSomething }
      ></canvas>
    );
  }
}
