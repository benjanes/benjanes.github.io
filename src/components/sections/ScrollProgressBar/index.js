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

    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    const ctx = this.$canvas.getContext('2d');
    const canvasHeight = window.innerHeight;
    const documentHeight = document.body.offsetHeight;
    const scrollableHeight = documentHeight - canvasHeight;
    const d = canvasHeight / (this.props.maxRows - 1);
    const handleScroll = this.handleScroll;

    this.setState({
      ctx,
      canvasHeight,
      scrollableHeight,
      d
    }, this.animateProgressBar);

    window.addEventListener('scroll', handleScroll);
  }

  componentWillUnmount() {
    const handleScroll = this.handleScroll;
    window.removeEventListener('scroll', handleScroll);
    // cancelAnimationFrame...
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
    const ctx = this.state.ctx;
    const triangles = this.state.triangles;
    const d = this.state.d;

    ctx.clearRect(0, 0, this.$canvas.width, this.$canvas.height);
    drawTriangles(triangles, ctx, d);

    requestAnimFrame(this.animateProgressBar.bind(this));
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
