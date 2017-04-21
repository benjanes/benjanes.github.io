import React, { Component } from 'react';
import { Link } from 'react-router';
import { styles } from './styles.scss';


// can probably achieve conditional animations by accessing lastPath prop from the App component (parent of About)
export default class ContentCard extends Component {
  constructor(props) {
    super(props);
  }

  renderPostInfo() {
    return <p>[{ this.props.content.tags.reduce((str, tag) => `${str}, ${tag}`) }]</p>;
  }

  renderProjectLinks() {
    const links = [];
    if (this.props.content.projLink) links.push({ type: 'project', href: this.props.content.projLink });
    if (this.props.content.ghLink) links.push({ type: 'github', href: this.props.content.ghLink });
    if (this.props.content.cpLink) links.push({ type: 'codepen', href: this.props.content.cpLink });

    return (
      <div>
        { links.map(link => {
          return (
            <a href={ link.href } key={ link.type }>
              <i className={ `fa fa-${link.type}` }></i>
            </a>
          )
        })}
      </div>
    )
  }

  renderAdditionalInfo() {
    return (
      <div className='addl-info'>
        <div className='addl-info-inner'>
          <p>{ this.props.content.desc }</p>
          { this.props.type === 'post' && this.renderPostInfo() }
          { this.props.type === 'project' && this.renderProjectLinks() }
        </div>
      </div>
    )
  }

  renderContent() {
    if (!this.props.content) return;
    return (
      <div className='card-container'>
        <h2>{ this.props.content.title }</h2>
        { this.props.isMediumSize && this.renderAdditionalInfo() }
        
      </div>
    );
  }

  generatePostUrl() {
    const post = this.props.content;
    if (!post) return;
    return `/${post.year}/${post.month}/${post.day}/${post.filename}`;
  }

  renderPost() {
    return (
      <Link
        className='post-link'
        to={ this.generatePostUrl() }
      >
        { this.renderContent() }
      </Link>
    );
  }

  render() {
    return (
      <div className={ `${styles} card-container-outer` }>
        { this.props.type === 'post' && this.renderPost() }
        { this.props.type === 'project' && this.renderContent() }
      </div>
    );
  }
}
