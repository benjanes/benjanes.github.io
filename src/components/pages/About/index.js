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
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
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
