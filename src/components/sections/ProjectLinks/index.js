import React from 'react';

export default function ProjectLinks(props) {
	const links = [];
	if (props.content.mainLink) links.push({ type: 'link', href: props.content.mainLink });
	if (props.content.ghLink) links.push({ type: 'github', href: props.content.ghLink });
	if (props.content.cpLink) links.push({ type: 'codepen', href: props.content.cpLink });
	if (props.content.email) links.push({ type: 'envelope', href: `mailto:${props.content.email}` });

	return (
		<div
			style={{ textAlign: 'center' }}
		>
			{ links.map(link => {
				return (
					<a href={ link.href } key={ link.type } className='proj-link-btn' target='_blank'>
						<i className={ `fa fa-${link.type}` }></i>
					</a>
				);
			})}
		</div>
	);
};
