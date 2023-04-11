import React, {useEffect, useState} from 'react';
import SettingsForm from "./SettingsForm";
import GraphVizWrapper from './GraphVizWrapper';
import {useSettings} from './settings';
import {saveSvgAsPng, svgAsDataUri} from 'save-svg-as-png';
import {
    useBase,
    useLoadable,
    useSettingsButton,
    useViewport,
    useWatchable,
    Box,
    expandRecord,
    initializeBlock,
    useViewMetadata
} from '@airtable/blocks/ui';
import {RenderGraphViz} from "./RenderGraphViz.js"

export const ExportType = Object.freeze({
    PNG: 'png',
    SVG: 'svg',
});

function TabGraphApp() {
    const viewport = useViewport();
    const [isSettingsVisible, setIsSettingsVisible] = useState(true);

    useSettingsButton(() => {
        if (!isSettingsVisible) {
            viewport.enterFullscreenIfPossible();
        }
        setIsSettingsVisible(!isSettingsVisible);
    });
    const base = useBase();
    const settingsValidationResult = useSettings(base);
    const settings = settingsValidationResult.settings;
    useLoadable(settings.queryResult1);
    useWatchable(settings.queryResult1, ['records', 'cellValues', 'recordColors']);
    useLoadable(settings.subQueryResult1);
    useWatchable(settings.subQueryResult1, ['records', 'cellValues']);
    useLoadable(settings.queryResult2);
    useWatchable(settings.queryResult2, ['records', 'cellValues', 'recordColors']);
    useLoadable(settings.subQueryResult2);
    useWatchable(settings.subQueryResult2, ['records', 'cellValues']);
    useLoadable(settings.queryResult3);
    useWatchable(settings.queryResult3, ['records', 'cellValues', 'recordColors']);
    useLoadable(settings.subQueryResult3);
    useWatchable(settings.subQueryResult3, ['records', 'cellValues']);

    const tableMetaDatas = {};
    const viewMetadata1 = useViewMetadata(settings.view1);
    const subviewMetadata1 = useViewMetadata(settings.subview1);
    const viewMetadata2 = useViewMetadata(settings.view2);
    const subviewMetadata2 = useViewMetadata(settings.subview2);
    const viewMetadata3 = useViewMetadata(settings.view3);
    const subviewMetadata3 = useViewMetadata(settings.subview3);

    if(settings.view1){
        addTableViewMetaData(tableMetaDatas, base,  settings.table1, viewMetadata1,(settings.embedFieldLink1?settings.embedFieldLink1.id:null),true);
    }
    if(settings.subview1){
        addTableViewMetaData(tableMetaDatas, base,  settings.embedFieldTable1, subviewMetadata1,settings.embedReverseFieldId1,false);
    }
    if(settings.view2){
        addTableViewMetaData(tableMetaDatas, base,  settings.table2, viewMetadata2,null,true);
    }
    if(settings.subview2){
        addTableViewMetaData(tableMetaDatas, base,  settings.embedFieldTable2, subviewMetadata2,settings.embedReverseFieldId2,false);
    }
    if(settings.view3){
       addTableViewMetaData(tableMetaDatas, base,  settings.table3, viewMetadata3,null,true);
    }
    if(settings.subview3){
        addTableViewMetaData(tableMetaDatas, base,  settings.embedFieldTable3, subviewMetadata3,settings.embedReverseFieldId3,false);
    }

    const [dot, setDot] = useState(null);

    useEffect(() => {
        try {
            const response = RenderGraphViz(settings,tableMetaDatas);
            setDot(response); 
        } catch (error) {
            console.log("error:", error);
        }
    }, [settings]);

    function spanText() {
        if (settings.table1 == null) {
            return "No Table specified";
        }
        if (settings.view1 == null) {
            return "No View specified";
        }
        if (dot == null) {
            return "Waiting to generate graph";
        }  
        return null;
    }
    
    function _onExportGraph(exportType) {
        const svgElement =  svgRef.current;
        if (svgElement) {
            if (exportType === ExportType.PNG) {
                saveSvgAsPng(svgElement, `${settings.table1.name}.png`, {
                    scale: 2.0,
                });
            } else if (exportType === ExportType.SVG) {
                // Convert the SVG to a data URI and download it via an anchor link.
                svgAsDataUri(svgElement, {}, uri => {
                    const downloadLink = document.createElement('a');
                    downloadLink.download = `${settings.table1.name}.svg`;
                    downloadLink.href = uri;
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                });
            } else {
                throw new Error('Unexpected export type: ', exportType);
            }
        }
    }

    function _onGraphClick(e) {
        if (!settings.queryResult1 || !settings.queryResult1.isDataLoaded) {
            return;
        }
        let target = e.target || null;
        // Traverse up the element tree from the click event target until we find an svg element
        // describing a 'node' that has a corresponding record that we can expand.
        while (target) {
            if (target.classList.contains('node')) {
                const record1 = settings.queryResult1.getRecordByIdIfExists(target.id);
                if (record1) {
                    expandRecord(record1);
                    return; 
                }
                if(settings.view2){
                    const record2 = settings.queryResult2.getRecordByIdIfExists(target.id);
                    if (record2) {
                        expandRecord(record2);
                        return;
                    }
                }
                if(settings.view3){
                    const record3 = settings.queryResult3.getRecordByIdIfExists(target.id);
                    if (record3) {
                        expandRecord(record3);
                        return;
                    }
                }
            }
            target = target.parentElement;
        }
    }

    const spantext = spanText();
    const svgRef = React.createRef();

    return (
        <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            display="flex"
            backgroundColor="#f5f5f5"
            overflow="hidden"
        >
            <div
                style={{
                    flex: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 0,
                    height: '100%',
                }} 
                onClick={_onGraphClick}
            > 
                <GraphVizWrapper dot = {dot} subtractWidth={isSettingsVisible?350:0} svgRef={svgRef}>
                    <span className="prompt">{spantext}</span>
                </GraphVizWrapper>
            </div>
            {isSettingsVisible && settings.canUpdateGlobalConfig &&(
                <SettingsForm 
                    setIsSettingsVisible={setIsSettingsVisible}
                    onExportGraph={_onExportGraph}
                    settingsValidationResult={settingsValidationResult}
                />
            )}
        </Box>
    );
}

initializeBlock(() => <TabGraphApp />);


function addTableViewMetaData(tableViewMetaData, base,aTable,viewMetadata, embedFieldId, includeTable){
    const tableView = {}
    tableViewMetaData[aTable.name] = tableView;

    if(tableViewMetaData["Included Tables"] == undefined){
        tableViewMetaData["Included Tables"] = new Set();
    } 

    if(includeTable){
        tableViewMetaData["Included Tables"].add(aTable.id); 
    }
    
    viewMetadata.visibleFields.map(field => {
        const fieldMetaData = {
            fieldId : field.id,
            fieldName : field.name,
            fieldType : field.type,
            embedField : (field.id == embedFieldId)
        }

        tableView[field.name] = fieldMetaData;

        if(field.type == "multipleRecordLinks") {
            const ref_table = base.getTableByIdIfExists(field.options.linkedTableId);
            fieldMetaData['linkedTableId'] = ref_table.id;
            fieldMetaData['linkedTableName'] = ref_table.name;      
        } else { 
            // non linked column
        }
    });
}
