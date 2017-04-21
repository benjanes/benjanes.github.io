import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { styles } from './styles.scss';

export default class InfoOverlay extends Component {
	constructor(props) {
		super(props);

		console.log(props.detail);

		this.handleClick = this.handleClick.bind(this);
	}

	componentWillEnter(next) {
		const el = ReactDOM.findDOMNode(this);
		TweenMax.fromTo(el, 0.4, { opacity: 0 }, { opacity: 1, onComplete: next });
	}

	componentWillLeave(next) {
		const el = ReactDOM.findDOMNode(this);
		TweenMax.fromTo(el, 0.4, { opacity: 1 }, { opacity: 0, onComplete: next });
	}

	handleClick() {
		this.props.setShowOverlay(false);
	}

	renderProjectLinks(detail) {
		const links = [];
		if (detail.projLink) links.push({ type: 'project', href: detail.projLink });
		if (detail.ghLink) links.push({ type: 'github', href: detail.ghLink });
		if (detail.cpLink) links.push({ type: 'codepen', href: detail.cpLink });

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

	render() {
		const detail = this.props.detail;
		return (
			<div className={ `${styles}` }>
				<div className='close-btn'>
					<button onClick={ this.handleClick }>
						X
					</button>
				</div>
				<h2>{ detail.title }</h2>
				<p>{ detail.desc }</p>
				{ this.renderProjectLinks(detail) }
			</div>
		)
	}

}
