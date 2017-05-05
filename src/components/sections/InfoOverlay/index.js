import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ProjectLinks from '../ProjectLinks';
import { styles } from './styles.scss';

export default class InfoOverlay extends Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	componentWillEnter(next) {
		const el = ReactDOM.findDOMNode(this);
		TweenMax.fromTo(el, 0.4, { x: '-100%' }, { x: '0%', onComplete: next });
	}

	componentWillLeave(next) {
		const el = ReactDOM.findDOMNode(this);
		TweenMax.fromTo(el, 0.4, { x: '0%' }, { x: '-100%', onComplete: next });
	}

	handleClick() {
		this.props.setShowOverlay(false);
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
				<ProjectLinks content={ detail } />
			</div>
		)
	}

}
