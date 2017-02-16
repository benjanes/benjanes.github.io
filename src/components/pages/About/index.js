import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { styles } from './styles.scss';


// can probably achieve conditional animations by accessing lastPath prop from the App component (parent of About)
export default class About extends Component {
  constructor(props) {
    super(props);
  }

  componentWillEnter(next) {
    const tl = new TimelineMax();

    tl
      .set(this.$card1, { transformOrigin: '50% 100%', rotationX: 91 })
      .set(this.$card2, { transformOrigin: '0% 50%', rotationY: 91 })
      .set(this.$card3, { transformOrigin: '50% 0%', rotationX: -91 })
      .set(this.$card4, { transformOrigin: '100% 50%', rotationY: -91 })
      .to(this.$card3, 0.25, { rotationX: 0 }, '+=1')
      .to(this.$card4, 0.25, { rotationY: 0 })
      .to(this.$card1, 0.25, { rotationX: 0 })
      .to(this.$card2, 0.25, { rotationY: 0 })
      .call(next);
  }

  componentWillLeave(next) {
    const tl = new TimelineMax();

    tl
      .set(this.$card1, { transformOrigin: '50% 100%', rotationX: 0 })
      .set(this.$card2, { transformOrigin: '0% 50%', rotationY: 0 })
      .set(this.$card3, { transformOrigin: '50% 0%', rotationX: 0 })
      .set(this.$card4, { transformOrigin: '100% 50%', rotationY: 0 })
      .to(this.$card2, 0.25, { rotationY: 91 })
      .to(this.$card1, 0.25, { rotationX: 91 })
      .to(this.$card4, 0.25, { rotationY: -91 })
      .to(this.$card3, 0.25, { rotationX: -91 })
      .call(next);
  }

  renderContent() {
    return (
      <div className='about-content'>
        <div className='about-content-inner'>
          <h1>About</h1>
          <p>I am a full stack software developer based in the greater NYC area. I love to tackle complex, 
          challenging problems in a collaborative, dynamic team environment. I have an aptitude for building 
          effective, engaging user interfaces. In recent projects I have focused on ...</p>
          <p>In a previous life, I worked as a botanist and plant ecologist. When I'm not programming, 
          I mostly either go rock climbing or spend time thinking about going rock climbing. I also enjoy 
          hiking and backpacking with my wife and dog.</p>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className={ `${styles}` }>
        <div
          ref={ card => this.$card1 = card }
          className='about-panel'
        >
          { this.renderContent() }
        </div>
        <div
          ref={ card => this.$card2 = card }
          className='about-panel'
        >
          { this.renderContent() }
        </div>
        <div
          ref={ card => this.$card4 = card }
          className='about-panel'
        >
          { this.renderContent() }
        </div>
        <div
          ref={ card => this.$card3 = card }
          className='about-panel'
        >
          { this.renderContent() }
        </div>
      </div>
    );
  }
}
