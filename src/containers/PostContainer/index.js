import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { styles } from './styles.scss';
import { browserHistory } from 'react-router';

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

  componentWillReceiveProps(nextProps) {
    console.log(nextProps.post);
  }

  handleClick(e) {
    if (e.target.tagName !== 'A') return;
    const href = e.target.getAttribute('href');
    if (!/^\//.test(href)) return;

    e.preventDefault();
    browserHistory.push(href);
  }

  renderContent() {
    if (!this.props.post) return;
    return (
      <div>
        <h2>{ this.props.post.meta.title }</h2>
        <div
          className='content'
          dangerouslySetInnerHTML={{ __html: this.props.post.content }}
          onClick={ this.handleClick }
        >
        </div>
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
