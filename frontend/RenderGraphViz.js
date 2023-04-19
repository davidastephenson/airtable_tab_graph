
import { colorUtils } from '@airtable/blocks/ui';
import { LinkStyle, ChartOrientation, ShapeAs, ColourBy } from './settings';

const DEBUG_OUTPUT = true; // Set to true to log layout source string to console

export function RenderGraphViz(settings, tableMetaDatas) {
	const { chartOrientation, linkStyle } = settings;

	if (tableMetaDatas == null || Object.keys(tableMetaDatas) == 0) {
		return null;
	}

	let source = 'digraph {\n\t'
	source += 'bgcolor=transparent\n\t';
	source += 'pad=0.25\n\t';
	source += `layout=${settings.layoutEngine}\n\t`;
	source += 'defaultdist="4"\n\t';
	source += 'concentrate=true\n\t';
	source += 'nodesep=0.75\n\t';

	if (chartOrientation != ChartOrientation.HORIZONTAL) {
		source += 'rankdir=LR\n\t';
	}

	switch (linkStyle) {
		case LinkStyle.STRAIGHT_LINES:
			source += 'splines=line\n\n\t';
			break;
		case LinkStyle.CURVED_LINES:
			source += 'splines=curved\n\n\t';
			break;
		case LinkStyle.RIGHT_ANGLES:
		default:
			source += 'splines=ortho\n\n\t';
			break;
	}

	source += ' \n\nnode [\n\t\t';
	source += 'shape=rect\n\t\t';
	source += 'fontname=Helvetica\n\t';
	source += ']\n\n\t';

	const displayedRecords = extractDisplayedRecordIds([settings.queryResult1, settings.queryResult2, settings.queryResult3]);

	const nodeMap = {}; // clusterName => [nodes]
	const edges = {}; // lowID + highId => edgeString
	const includedTables = tableMetaDatas["Included Tables"];

	let tableSettings = {
		"tableXShapeAs": settings.table1ShapeAs,
		"tableXShape": settings.table1Shape,
		"tableXFieldShape": settings.fieldShape1,
		"tableXRounded": settings.table1Rounded,
		"tableXColourBy": settings.table1ColourBy,
		"tableXColour": settings.table1Colour,
		"tableXIncludeFields": settings.table1IncludeFields == true,
		"embedFieldLinkX": settings.embedFieldLink1,
		"embedFieldTableX": settings.embedFieldTable1,
		"embedReverseFieldId": settings.embedReverseFieldId1,
		"tableXClusterByFieldId": settings.table1ClusterByFieldId,
	}
	if (settings.subview1) {
		createNodesFromAView(tableSettings, displayedRecords, nodeMap, edges, settings.queryResult1, tableMetaDatas[settings.table1.name], settings.subQueryResult1, tableMetaDatas[settings.embedFieldTable1.name], includedTables);
	} else {
		createNodesFromAView(tableSettings, displayedRecords, nodeMap, edges, settings.queryResult1, tableMetaDatas[settings.table1.name], null, null, includedTables);
	}

	if (settings.table2 && settings.view2) {
		tableSettings = {
			"tableXShapeAs": settings.table2ShapeAs,
			"tableXShape": settings.table2Shape,
			"tableXFieldShape": settings.fieldShape2,
			"tableXRounded": settings.table2Rounded,
			"tableXColourBy": settings.table2ColourBy,
			"tableXColour": settings.table2Colour,
			"tableXIncludeFields": settings.table2IncludeFields == true,
			"embedFieldLinkX": settings.embedFieldLink2,
			"embedFieldTableX": settings.embedFieldTable2,
			"embedReverseFieldId": settings.embedReverseFieldId2,
			"tableXClusterByFieldId": settings.table2ClusterByFieldId,
		}
		if (settings.subview2 && settings.embedFieldTable2) {
			createNodesFromAView(tableSettings, displayedRecords, nodeMap, edges, settings.queryResult2, tableMetaDatas[settings.table2.name], settings.subQueryResult2, tableMetaDatas[settings.embedFieldTable2.name], includedTables);
		} else {
			createNodesFromAView(tableSettings, displayedRecords, nodeMap, edges, settings.queryResult2, tableMetaDatas[settings.table2.name], null, null, includedTables);
		}
	}

	if (settings.table3 && settings.view3) {
		tableSettings = {
			"tableXShapeAs": settings.table3ShapeAs,
			"tableXShape": settings.table3Shape,
			"tableXFieldShape": settings.fieldShape3,
			"tableXRounded": settings.table3Rounded,
			"tableXColourBy": settings.table3ColourBy,
			"tableXColour": settings.table3Colour,
			"tableXIncludeFields": settings.table3IncludeFields == true,
			"embedFieldLinkX": settings.embedFieldLink3,
			"embedFieldTableX": settings.embedFieldTable3,
			"embedReverseFieldId": settings.embedReverseFieldId3,
			"tableXClusterByFieldId": settings.table3ClusterByFieldId,
		}
		if (settings.subview3 && settings.embedFieldTable3) {
			createNodesFromAView(tableSettings, displayedRecords, nodeMap, edges, settings.queryResult3, tableMetaDatas[settings.table3.name], settings.subQueryResult3, tableMetaDatas[settings.embedFieldTable3.name], includedTables);
		} else {
			createNodesFromAView(tableSettings, displayedRecords, nodeMap, edges, settings.queryResult3, tableMetaDatas[settings.table3.name], null, null, includedTables);
		}
	}

	for (let clusterName of Object.keys(nodeMap)) {
		source += `\nsubgraph cluster_${clusterName} {\n`;
		source += "\n\tperipheries=0;\n";
		let nodes = nodeMap[clusterName];
		source += nodes.join('\n\t');
		source += '}\n';
	}

	source += '\n\n\t';
	source += Object.values(edges).join('\n\t');
	source += '\n}';

	DEBUG_OUTPUT && console.log(source);
	return source;
}

function createNodesFromAView(tableSettings, displayedRecords, nodeMap, edges, queryResultA, tableMetaDataA, queryResultB, tableMetaDataB, includedTables) {
	for (const record of queryResultA.records) {
		if (record.isDeleted) {
			continue;
		}
		const recordColor = queryResultA.getRecordColor(record);


		createANodeFromAView(tableSettings, displayedRecords, nodeMap, edges, record, tableMetaDataA, queryResultB, tableMetaDataB, includedTables, recordColor);
	}
}

function createANodeFromAView(tableSettings, displayedRecords, nodeMap, edges, record, tableMetaDataA, queryResultB, tableMetaDataB, includedTables, recordColor) {
	const clusterName = tableSettings.tableXClusterByFieldId ? escapeGraphviz(record.getCellValueAsString(tableSettings.tableXClusterByFieldId)) : "alltheothers";

	if (nodeMap.hasOwnProperty(clusterName) == false) {
		nodeMap[clusterName] = [];
	}
	const nodes = nodeMap[clusterName];

	let rowsInLabel = 0;
	let theColour = null;
	let shouldUseLightText = null

	if (tableSettings.tableXColourBy === ColourBy.FIXEDCOLOUR) {
		theColour = tableSettings.tableXColour;
		shouldUseLightText = false;
	} else {
		theColour = recordColor ? colorUtils.getHexForColor(recordColor) : 'white'
		shouldUseLightText = colorUtils.shouldUseLightTextOnColor(recordColor);
	}


	let displayText = record.name
		.substring(0, 50)
		.trim()
		.replace(/"/g, '\\"');
	if (record.name.length > 50) {
		displayText += '...';
	}
	displayText = escapeHtml(displayText);
	
	if(displayText == ""){
		displayText = " ";
	}

	let nodeDetails = `<<table border="0" cellborder="1" cellspacing="0" cellpadding="4"> <tr> <td> <b>${displayText}</b></td></tr>  <tr><td><table border="0" cellborder="0" cellspacing="0" >\n`

	for (let fieldMetaData of Object.values(tableMetaDataA)) {
		let cellValueAsString = record.getCellValueAsString(fieldMetaData.fieldName);

		if (cellValueAsString.length > 50) {
			cellValueAsString = cellValueAsString.substring(0, 50);
		}
		const cleanCellValueAsString = escapeHtml(cellValueAsString);

		if (fieldMetaData.fieldType == "multipleRecordLinks") {
			let cellValue = record.getCellValue(fieldMetaData.fieldName);

			if (tableSettings.tableXIncludeFields && fieldMetaData.embedField == false) {
				rowsInLabel++;
				nodeDetails += `<tr> <td port="${fieldMetaData.fieldId}" align="left" >${fieldMetaData.fieldName} : ${cleanCellValueAsString}</td> </tr>`;
			}

			if (fieldMetaData.embedField) {
				// omit the embedded field as this will be handled below in second query.
			} else if (cellValue != null && includedTables.has(fieldMetaData.linkedTableId)) {
				cellValue.forEach(item => {
					if (displayedRecords.has(item.id)) {
						let lowerId = null;
						let higherId = null;
						if (record.id > item.id) {
							higherId = record.id;
							lowerId = item.id;
						} else {
							higherId = item.id;
							lowerId = record.id;
						}

						// node_ContractSectionContractSection:contractRelationship -> node_ContractContract[dir=both, arrowhead=none, arrowtail=odiamond];
						edges[`${lowerId}:${higherId}`] = `${lowerId} -> ${higherId}[dir=both, arrowhead=normal, arrowtail=normal ]`;
					}
				})
			}
		} else {
			if (tableSettings.tableXIncludeFields) {
				rowsInLabel++;
				nodeDetails += `<tr> <td align="left" >${fieldMetaData.fieldName} : ${cleanCellValueAsString}</td> </tr>`;
			}
		}
	}

	if (queryResultB && tableMetaDataB) {
		let toEmbedRecords = queryResultB.records.filter(aRecord => {
			const cv = aRecord.getCellValue(tableSettings.embedReverseFieldId)
			if(cv != null){
				return (cv.map(r => { return r.id }).includes(record.id));
			}
			return false;
		});

		for (let embedRecord of toEmbedRecords) {
			let rowValueAsString = embedRecord.name;

			if (rowValueAsString.length > 50) {
				rowValueAsString = rowValueAsString.substring(0, 50);
			}
			const cleanRowValueAsString = escapeHtml(rowValueAsString);

			if (tableSettings.tableXIncludeFields) {
				rowsInLabel++;
				nodeDetails += `<tr> <td align="left" >${cleanRowValueAsString}</td> </tr>`;
			}			

			for (let fieldMetaData of Object.values(tableMetaDataB)) {
				if (fieldMetaData.fieldType == "multipleRecordLinks" && fieldMetaData.embedField == false) {
					let cellValue = embedRecord.getCellValue(fieldMetaData.fieldName);

					if (cellValue != null && includedTables.has(fieldMetaData.linkedTableId)) {
						cellValue.forEach(item => {
							if (displayedRecords.has(item.id)) {
								let lowerId = null;
								let higherId = null;
								if (record.id > item.id) {
									higherId = record.id;
									lowerId = item.id;
								} else {
									higherId = item.id;
									lowerId = record.id;
								}

								edges[`${lowerId}:${higherId}`] = `${lowerId} -> ${higherId}[dir=both, arrowhead=normal, arrowtail=normal ]`;
							}
						})
					}
				} else {
					// ignore non link fields
				}
			}
		}
	}

	nodeDetails += `\n</table></td></tr></table>>`;

	if (rowsInLabel == 0 || (tableSettings.tableXIncludeFields == false && tableSettings.embedFieldLinkX == null)) {
		nodeDetails = "\"" + displayText + "\"";
	}

	let theShape = null;

	if (tableSettings.tableXShapeAs === ShapeAs.FIXEDSHAPE) {
		theShape = tableSettings.tableXShape;
	} else {
		if (tableSettings.tableXfield != null) {
			theShape = record.getCellValueAsString(tableSettings.tableXfield);
		} else {
			theShape = "rect";
		}
	}

	nodes.push(
		`${record.id} [id="${record.id}"
        tooltip="${displayText}"
        style="filled${tableSettings.tableXRounded ? ',rounded' : ''}"
        shape="${theShape}"
        fontcolor="${shouldUseLightText ? 'white' : 'black'}"  
        fillcolor="${theColour}"
        label=${nodeDetails}
        ]`,
	);
}

function extractDisplayedRecordIds(arrayOfQuery) {
	let recordIds = new Set();

	for (const query of arrayOfQuery) {
		if (query == null || query == undefined) {
			continue;
		}
		for (const record of query.records) {
			recordIds.add(record.id);
		}
	}
	return recordIds;
}

const escapeGraphviz = (unsafe) => {
	return unsafe.replaceAll(' ', '_').replaceAll('-', '_').replaceAll('<', '_lt_').replaceAll('>', '_gt_').replaceAll('"', '_quot_').replaceAll("'", '_');
}

const escapeHtml = (unsafe) => {
	return unsafe.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}