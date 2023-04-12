import * as React from 'react';
import { useEffect, useMemo } from 'react';
import { graphviz } from 'd3-graphviz';

const defaultOptions = {
	fit: true,
	height: 5000,
	width: 5000,
	zoom: true,
};

let counter = 0;
const getId = () => `graphviz${counter++}`;

const GraphvizReact = ({ dot, options = {} }) => {
	const id = useMemo(getId, []);

	useEffect(() => {
		try {
			graphviz(`#${id}`, {
				...defaultOptions,
				...options,
			}).renderDot(dot);
		} catch (e) {
			console.error("graphviz failed to render:" + e);
		}
	}, [dot, options]);

	return <div id={id} />;
};

export { GraphvizReact };
export default GraphvizReact;