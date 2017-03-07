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
        .set([this.$btn1, this.$btn2], { transformOrigin: '0% 50%', rotationY: -91, backfaceVisibility: 'hidden' })
        .to(this.$btn1, 0.4, { rotationY: 0 }, '+=1')
        .to(this.$btn2, 0.4, { rotationY: 0 }, 1.15);
    }
    tl.call(next);
  }

  componentWillLeave(next) {
    // switch this for nav between posts...
    const el = ReactDOM.findDOMNode(this);

    TweenMax.set([el, this.$btn1, this.$btn2], { css: { zIndex: -1 }});
    TweenMax.set(el, { opacity: 0, delay: 1, onComplete: next });

    // TweenMax.to(el, 1, { opacity: 0, onComplete: next });
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
