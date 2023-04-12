import React, { useEffect, useRef, useCallback } from "react";
import { GraphvizReact } from "./GraphvizReact.js";

export default ({ dot, width, height }) => {
	// gen css from props
	const style = {
		width: width || "100%",
		height: height || 800,
	};
	const graphvizRoot = useRef(null);

	// update style in Graphviz div
	useEffect(() => {
		if (graphvizRoot.current) {
			const { id } = graphvizRoot.current;
			// use DOM id update style
			const el = document.getElementById(id);
			for (let [k, v] of Object.entries(style)) {
				el.style[k] = v;
			}
			graphviz(`#${id}`);
		}
	}, [graphvizRoot]);

	return (
		<div
			style={{
				...style,
				position: "relative",
			}}
		>
			{dot !== ""
				? [
					<GraphvizReact
						key="43"
						dot={dot}
						options={{
							useWorker: false,
							...style,
							zoom: true,
							//...propsinnerRef
						}}
						innerRef={graphvizRoot}
					/>,
				]
				: null}
		</div>
	);
};
