import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { styles } from './styles.scss';
import { browserHistory } from 'react-router';
import ScrollProgressBar from '../../components/sections/ScrollProgressBar';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getPost } from '../../store/actions.js';

class PostContainer extends Component {
  constructor(props) {
    super(props);

    const params = props.params;
    const file = `${params.year}-${params.month}-${params.day}-${params.filename}`;
    this.props.getPost(file);
  }

  handleClick(e) {
    if (e.target.tagName !== 'A') return;
    const href = e.target.getAttribute('href');
    if (!/^\//.test(href)) return;

    e.preventDefault();
    browserHistory.push(href);
  }

  renderDate() {
    return (
      <time
        itemProp='datePublished'
        dateTime={ this.props.post.meta.date }
      >
        { `${ parseInt(this.props.post.meta.month) }-${ parseInt(this.props.post.meta.day )}-${ this.props.post.meta.year }` }
      </time>
    )
  }

  renderContent() {
    if (!this.props.post) return;
    return (
      <div>
        <div itemType='http://schema.org/BlogPosting'>
          <meta itemProp='keywords' content={ this.props.post.meta.tags.join(',') } />
          <meta itemProp='description' content={ this.props.post.meta.desc } />
          <header>
            <h1 itemProp='name'>{ this.props.post.meta.title }</h1>
            { this.renderDate() }
          </header>
          <article
            className='content'
            itemProp='articleBody'
            dangerouslySetInnerHTML={{ __html: this.props.post.content }}
            onClick={ this.handleClick }
          >
          </article>
        </div>
        <ScrollProgressBar
          maxRows={ 40 }
        />
      </div>
    )
  }

  render() {
    return (
      <div className={ `${styles}` }>
        { this.renderContent() }
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ getPost }, dispatch);
}

function mapStateToProps({ rootState }) {
  return {
    post: rootState.appData.post
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PostContainer);
