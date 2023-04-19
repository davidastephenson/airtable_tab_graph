import React, { useEffect, useState } from "react";
import { Graphviz } from "@hpcc-js/wasm/graphviz";
import SVG from "react-inlinesvg";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useWindowSize } from "@react-hook/window-size";

export default ({ dot, subtractWidth, svgRef, children }) => {
	const [width, height] = useWindowSize({
		initialWidth: 400,
		initialHeight: 400,
	});
	const [svg, setSvg] = useState("");

	useEffect(() => {
		async function getSvg() {
			try {
				const graphviz = await Graphviz.load();
				const svg = await graphviz.dot(dot);
				setSvg(svg);
			} catch(error){
				console.log("error=" + error);
				setSvg(`<svg height="30" width="200">
				<text x="0" y="15" fill="red">${error}</text>
			  </svg>`);
			}
		}	
		getSvg();
	}, [dot]);

	return (
		<div>
			<TransformWrapper maxScale={100}>
				<TransformComponent>
					<SVG
						innerRef={svgRef}
						src={svg}
						width={width - subtractWidth}
						height={height}
					>
						{children}
					</SVG>
				</TransformComponent>
			</TransformWrapper>
		</div>
	);
};
