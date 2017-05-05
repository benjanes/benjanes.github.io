import React, { Component } from 'react';
import { Triangle, drawTriangles } from '../../../utils/triangleUtils.js';

export default class ScrollProgressBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ctx: null,
      canvasHeight: 0,
      scrollableHeight: 0,
      d: 0,
      triangles: []
    };

    this.handleScroll = this.handleScroll.bind(this);
    this.drawProgressBar = this.drawProgressBar.bind(this);
    this.initializeProgressBar = this.initializeProgressBar.bind(this);
  }

  componentDidMount() {
    setTimeout(this.initializeProgressBar, 50);
    window.addEventListener('scroll', this.handleScroll);
  }

  initializeProgressBar() {
    let ctx = this.$canvas.getContext('2d');
    let canvasHeight = window.innerHeight;
    let documentHeight = document.body.offsetHeight;
    let scrollableHeight = documentHeight - canvasHeight;
    let d = canvasHeight / (this.props.maxRows - 1);

    this.setState({
      ctx,
      canvasHeight,
      scrollableHeight,
      d
    }, this.drawProgressBar);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    cancelAnimationFrame(this.rAF);
  }

  addTriangle(rowIdx, triangles) {
    triangles[triangles.length] = new Triangle(rowIdx, this.state.d);
    return triangles;
  }

  handleScroll(e) {
    let triangles = this.state.triangles.slice();
    const scrollPos = window.scrollY;
    const scrollProportion = scrollPos / this.state.scrollableHeight;
    const numRows = Math.ceil(scrollProportion * this.props.maxRows);

    if (triangles.length > numRows) {
      for (let i = triangles.length; i > numRows; i--) {
        triangles.pop();
      }
    } else if (triangles.length < numRows) {
      for (let i = triangles.length; i < numRows; i++) {
        triangles = this.addTriangle(i, triangles);
      }
    }

    this.setState({ triangles });
  }

  drawProgressBar() {
    const ctx = this.state.ctx;
    const triangles = this.state.triangles;
    const d = this.state.d;

    ctx.clearRect(0, 0, this.$canvas.width, this.$canvas.height);
    drawTriangles(triangles, ctx, d);

    this.rAF = requestAnimationFrame(this.drawProgressBar);
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
