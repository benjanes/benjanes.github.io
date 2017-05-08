import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import PostContainer from '../../../containers/PostContainer';
import { styles } from './styles.scss';

export default class BlogPost extends Component {
  constructor(props) {
    super(props);
  }

  componentWillEnter(next) {
    // switch this for nav between posts
    const tl = new TimelineMax();

    if (this.props.lastPath === '/blog') {
      tl
        .set([this.$btn1, this.$btn2], { x: '-100%', backfaceVisibility: 'hidden' })
        .to(this.$btn1, 0.4, { x: '0%', ease: Cubic.easeInOut }, '+=1')
        .to(this.$btn2, 0.4, { x: '0%', ease: Cubic.easeInOut }, 1.15);
    }
    tl.call(next);
  }

  componentWillLeave(next) {
    // switch this for nav between posts...
    const el = ReactDOM.findDOMNode(this);
    const tl = new TimelineMax();

    let delay = 1;

    // if (/\/\d\d\d\d\//.test(this.props.lastPath)) {
    //   delay = 0.4;
    //   tl.to(el, 0.4, { opacity: 0 });
    // } else {
      tl
        .set([this.$btn1, this.$btn2], { x: '0%', backfaceVisibility: 'hidden' })
        .set(el, { zIndex: -1 })
        .staggerTo([this.$btn1, this.$btn2], 0.3, { x: '-100%', ease: Cubic.easeInOut }, 0.15);
    // }

    tl.call(next, null, [], delay);
  }

  render() {
    return (
      <div className={ `${styles}` }>
        <div
          className='post-nav-btn fa'
          ref={ btn => this.$btn1 = btn }
        >
          <Link
            to='/blog'
          >
            <span>&#xf053;</span>
          </Link>
        </div>
        <div
          className='post-nav-btn fa'
          ref={ btn => this.$btn2 = btn }
        >
          <Link
            to='/'
          >
            <span>&#xf015;</span>
          </Link>
        </div>

        <PostContainer
          params={ this.props.params }
        />
      </div>
    );
  }
}
