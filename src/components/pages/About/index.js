import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { styles } from './styles.scss';
import { Link } from 'react-router';

export default class About extends Component {
  constructor(props) {
    super(props);
  }

  componentWillEnter(next) {
    const tl = new TimelineMax();

    if (this.props.isMediumSize) {
      tl
        .set(this.$btn, { x: '-100%', backfaceVisibility: 'hidden' })
        .set(this.$card1, { transformOrigin: '50% 100%', rotationX: 91, backfaceVisibility: 'hidden' })
        .set(this.$card2, { transformOrigin: '0% 50%', rotationY: 91, backfaceVisibility: 'hidden' })
        .set(this.$card3, { transformOrigin: '50% 0%', rotationX: -91, backfaceVisibility: 'hidden' })
        .set(this.$card4, { transformOrigin: '100% 50%', rotationY: -91, backfaceVisibility: 'hidden' })
        .to(this.$card3, 0.25, { rotationX: 0, ease: Cubic.easeOut }, '+=1')
        .to(this.$card4, 0.25, { rotationY: 0, ease: Cubic.easeOut })
        .to(this.$card1, 0.25, { rotationX: 0, ease: Cubic.easeOut })
        .to(this.$card2, 0.25, { rotationY: 0, ease: Cubic.easeOut });
    }
    
    tl.call(next);
  }

  componentDidEnter() {
    TweenMax.to(this.$btn, 0.4, { x: '0%', ease: Cubic.easeInOut });
  }

  componentWillLeave(next) {
    const tl = new TimelineMax();
    const el = ReactDOM.findDOMNode(this);

    tl
      .set(this.$btn, { backfaceVisibility: 'hidden', x: '0%' })
      .to(this.$btn, 0.4, { x: '-100%', ease: Cubic.easeInOut }, 0);
    
    if (this.props.isMediumSize) {
      tl
        .set(this.$card1, { transformOrigin: '50% 100%', rotationX: 0, backfaceVisibility: 'hidden' })
        .set(this.$card2, { transformOrigin: '0% 50%', rotationY: 0, backfaceVisibility: 'hidden' })
        .set(this.$card3, { transformOrigin: '50% 0%', rotationX: 0, backfaceVisibility: 'hidden' })
        .set(this.$card4, { transformOrigin: '100% 50%', rotationY: 0, backfaceVisibility: 'hidden' })
        .to(this.$card2, 0.25, { rotationY: 91, ease: Power2.easeInOut })
        .set(this.$card2, { opacity: 0 })
        .to(this.$card1, 0.25, { rotationX: 91, ease: Power2.easeInOut })
        .set(this.$card1, { opacity: 0 })
        .to(this.$card4, 0.25, { rotationY: -91, ease: Power2.easeInOut })
        .set(this.$card4, { opacity: 0 })
        .to(this.$card3, 0.25, { rotationX: -91, ease: Power2.easeInOut })
        .set(this.$card3, { opacity: 0 });
        
    } else {
      tl.set(el, { zIndex: -1 });
    }
    
    tl.call(next, [], null, 1.4);
  }

  renderContent() {
    return (
      <div className='about-content'>
        <div className='about-content-inner'>
          <h1>About</h1>
          <p>I'm currently working as a senior software developer at McCann in NYC. Most of my work falls into one of three categories: rapidly prototyping projects with whatever stack makes sense for the job (I've recently used Swift for iOS development, WinJS for a native Windows app, and C++ for Arduino programming), maintaining and feature adding to our team's developer tools built in Node, and building out fully featured UIs with React/ES6.</p>
          <p>I get most fired up about building seemingly simple UIs, focusing on the functional aspects of JS programming (I'm currently teaching myself Haskell when I have free time), and working with data. In my previous life I worked as a plant ecologist. Through my graduate research and professional experience I gained a lot of experience working with data and performing data analysis, particularly analyses of covariance and time series analysis.</p>
          <p>When I'm not working or programming I can probably be found out rock climbing in the Gunks or the Adirondacks, hiking with my wife and dogs in the Hudson Valley, or starting in on the next in an endless series of home improvement projects.</p>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className={ `${styles} page-wrapper` }>
        <div
          ref={ card => this.$card1 = card }
          className='about-panel'
        >
          { this.renderContent() }
        </div>
          
        { this.props.isMediumSize && <div
            ref={ card => this.$card2 = card }
            className='about-panel'
          >
            { this.renderContent() }
          </div> }
        { this.props.isMediumSize && <div
          ref={ card => this.$card4 = card }
          className='about-panel'
        >
          { this.renderContent() }
        </div> }
        { this.props.isMediumSize && <div
          ref={ card => this.$card3 = card }
          className='about-panel'
        >
          { this.renderContent() }
        </div> }
        <div
          className='about-nav-btn fa'
          ref={ btn => this.$btn = btn }
        >
          <Link
            to='/'
          >
            <span>&#xf015;</span>
          </Link>
        </div>
      </div>
    );
  }
}
