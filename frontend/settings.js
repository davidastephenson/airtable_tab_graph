import { FieldType } from '@airtable/blocks/models';
import { useGlobalConfig } from '@airtable/blocks/ui';

export const ConfigKeys = {
    CHART_ORIENTATION: 'chartOrientation',
    LINK_STYLE: 'linkStyle',

    TABLE1_ID: 'table1Id',
    VIEW1_ID: 'view1Id',
    TABLE1_SHAPE_AS: 'table1ShapeAs',
    TABLE1_SHAPE: 'table1Shape',
    TABLE1_SHAPE_FIELD_ID: 'table1ShapeFieldId',
    TABLE1_SHAPE_ROUNDED: 'table1Rounded',
    TABLE1_COLOUR_BY: "table1ColourBy",
    TABLE1_COLOUR: "table1Colour",
    TABLE1_INCLUDE_FIELDS: "table1IncludeFields",
    TABLE1_EMBED_FIELDLINK: "table1EmbedFieldLink",
    TABLE1_EMBED_FIELDVIEW_ID: "table1EmbedFieldViewId",
    TABLE1_CLUSTER_BY_FIELD: "table1ClusterByFieldId",

    TABLE2_ID: 'table2Id',
    VIEW2_ID: 'view2Id',
    TABLE2_SHAPE_AS: 'table2ShapeAs',
    TABLE2_SHAPE: 'table2Shape',
    TABLE2_SHAPE_FIELD_ID: 'table2ShapeFieldId',
    TABLE2_SHAPE_ROUNDED: 'table2Rounded',
    TABLE2_COLOUR_BY: "table2ColourBy",
    TABLE2_COLOUR: "table2Colour",
    TABLE2_INCLUDE_FIELDS: "table2IncludeFields",
    TABLE2_EMBED_FIELDLINK: "table2EmbedFieldLink",
    TABLE2_EMBED_FIELDVIEW_ID: "table2EmbedFieldViewId",
    TABLE2_CLUSTER_BY_FIELD: "table2ClusterByFieldId",

    TABLE3_ID: 'table3Id',
    VIEW3_ID: 'view3Id',
    TABLE3_SHAPE_AS: 'table3ShapeAs',
    TABLE3_SHAPE: 'table3Shape',
    TABLE3_SHAPE_FIELD_ID: 'table3ShapeFieldId',
    TABLE3_SHAPE_ROUNDED: 'table3Rounded',
    TABLE3_COLOUR_BY: "table3ColourBy",
    TABLE3_COLOUR: "table3Colour",
    TABLE3_INCLUDE_FIELDS: "table3IncludeFields",
    TABLE3_EMBED_FIELDLINK: "table3EmbedFieldLink",
    TABLE3_EMBED_FIELDVIEW_ID: "table3EmbedFieldViewId",
    TABLE3_CLUSTER_BY_FIELD: "table3ClusterByFieldId",
};

export const RecordShape = Object.freeze({
    RECTANGLE: 'rectangle',
    ELLIPSE: 'ellipse',
    CIRCLE: 'circle',
    DIAMOND: 'diamond',
});

export const LinkStyle = Object.freeze({
    RIGHT_ANGLES: 'rightAngles',
    CURVED_LINES: 'curvedLines',
    STRAIGHT_LINES: 'straightLines',
});

export const ChartOrientation = Object.freeze({
    HORIZONTAL: 'horizontal',
    VERTICAL: 'vertical',
});

export const ColourBy = Object.freeze({
    FIXEDCOLOUR: 'fixedColour',
    RECORDCOLOUR: 'recordColour',
});

export const ShapeAs = Object.freeze({
    FIXEDSHAPE: 'fixedShape',
    FIELDSHAPE: 'fieldShape',
});

const defaults = Object.freeze({
    [ConfigKeys.CHART_ORIENTATION]: ChartOrientation.VERTICAL,
    [ConfigKeys.LINK_STYLE]: LinkStyle.RIGHT_ANGLES,

    [ConfigKeys.TABLE1_SHAPE_AS]: ShapeAs.FIXEDSHAPE,
    [ConfigKeys.TABLE1_SHAPE]: RecordShape.RECTANGLE,
    [ConfigKeys.TABLE1_SHAPE_ROUNDED]: true,
    [ConfigKeys.TABLE1_COLOUR_BY]: ColourBy.FIXEDCOLOUR,
    [ConfigKeys.TABLE1_COLOUR]: "lemonchiffon",
    [ConfigKeys.TABLE1_INCLUDE_FIELDS]: true,

    [ConfigKeys.TABLE2_SHAPE_AS]: ShapeAs.FIXEDSHAPE,
    [ConfigKeys.TABLE2_SHAPE]: RecordShape.RECTANGLE,
    [ConfigKeys.TABLE2_SHAPE_ROUNDED]: false,
    [ConfigKeys.TABLE2_COLOUR_BY]: ColourBy.FIXEDCOLOUR,
    [ConfigKeys.TABLE2_COLOUR]: "palegreen",
    [ConfigKeys.TABLE2_INCLUDE_FIELDS]: true,

    [ConfigKeys.TABLE3_SHAPE_AS]: ShapeAs.FIXEDSHAPE,
    [ConfigKeys.TABLE3_SHAPE]: RecordShape.DIAMOND,
    [ConfigKeys.TABLE3_SHAPE_ROUNDED]: true,
    [ConfigKeys.TABLE3_COLOUR_BY]: ColourBy.FIXEDCOLOUR,
    [ConfigKeys.TABLE3_COLOUR]: "cornflowerblue",
    [ConfigKeys.TABLE3_INCLUDE_FIELDS]: true,
});


/**
 * Reads the values stored in GlobalConfig and inserts defaults for missing values 
 */
function getRawSettingsWithDefaults(globalConfig) {
    const rawSettings = {};
    for (const globalConfigKey of Object.values(ConfigKeys)) {
        const storedValue = globalConfig.get(globalConfigKey);
        if (
            (storedValue === undefined || storedValue === null) &&
            Object.prototype.hasOwnProperty.call(defaults, globalConfigKey)
        ) {
            rawSettings[globalConfigKey] = defaults[globalConfigKey];
            globalConfig.setAsync(globalConfigKey, defaults[globalConfigKey]);
        } else {
            rawSettings[globalConfigKey] = storedValue;
        }
    }
    //(rawSettings);
    return rawSettings;
}

/**
 * Takes values read from GlobalConfig and converts them to Airtable objects where possible.
 */ 
function getSettings(rawSettings, base, globalConfig) {
    const table1 = base.getTableByIdIfExists(rawSettings.table1Id);
    const view1 = table1 ? table1.getViewByIdIfExists(rawSettings.view1Id) : null;
    const fieldShape1 = table1 ? table1.getFieldByIdIfExists(rawSettings.table1ShapeFieldId) : null;
    const embedFieldLink1 = table1 ? table1.getFieldByIdIfExists(rawSettings.table1EmbedFieldLink) : null;
    const embedFieldTableID1 = embedFieldLink1 && embedFieldLink1.options ? embedFieldLink1.options.linkedTableId : null;
    const embedReverseFieldId1 = embedFieldLink1 && embedFieldLink1.options ? embedFieldLink1.options.inverseLinkFieldId : null; 
    const embedFieldTable1 = embedFieldTableID1 ? base.getTableByIdIfExists(embedFieldTableID1) : null;
    const subview1 = embedFieldTable1 ? embedFieldTable1.getViewByIdIfExists(rawSettings.table1EmbedFieldViewId) : null;

    const table2 = view1 ? base.getTableByIdIfExists(rawSettings.table2Id) : null;
    const view2 = table2 ? table2.getViewByIdIfExists(rawSettings.view2Id) : null;
    const fieldShape2 = table2 ? table2.getFieldByIdIfExists(rawSettings.table2ShapeFieldId) : null;
    const embedFieldLink2 = table2 ? table2.getFieldByIdIfExists(rawSettings.table2EmbedFieldLink) : null;
    const embedFieldTableID2 = embedFieldLink2 && embedFieldLink2.options ? embedFieldLink2.options.linkedTableId : null;
    const embedReverseFieldId2 = embedFieldLink2 && embedFieldLink2.options ? embedFieldLink2.options.inverseLinkFieldId : null; 
    const embedFieldTable2 = embedFieldTableID2 ? base.getTableByIdIfExists(embedFieldTableID2) : null;
    const subview2 = embedFieldTable2 ? embedFieldTable2.getViewByIdIfExists(rawSettings.table2EmbedFieldViewId) : null;

    const table3 = view2 ? base.getTableByIdIfExists(rawSettings.table3Id) : null;
    const view3 = table3 ? table3.getViewByIdIfExists(rawSettings.view3Id) : null;
    const fieldShape3 = table3 ? table3.getFieldByIdIfExists(rawSettings.table3ShapeFieldId) : null;
    const embedFieldLink3 = table3 ? table3.getFieldByIdIfExists(rawSettings.table3EmbedFieldLink) : null;
    const embedFieldTableID3 = embedFieldLink3 && embedFieldLink3.options ? embedFieldLink3.options.linkedTableId : null;
    const embedReverseFieldId3 = embedFieldLink3 && embedFieldLink3.options ? embedFieldLink3.options.inverseLinkFieldId : null; 
    const embedFieldTable3 = embedFieldTableID3 ? base.getTableByIdIfExists(embedFieldTableID3) : null;
    const subview3 = embedFieldTable3 ? embedFieldTable3.getViewByIdIfExists(rawSettings.table3EmbedFieldViewId) : null;

    const queryResult1 = view1 ? view1.selectRecords({ fields: view1.fields }) : null;
    const subQueryResult1 = subview1 ? subview1.selectRecords({ fields: subview1.fields }) : null;    
    const queryResult2 = view2 ? view2.selectRecords({ fields: view2.fields }) : null;
    const subQueryResult2 = subview2 ? subview2.selectRecords({ fields: subview2.fields }) : null;  
    const queryResult3 = view3 ? view3.selectRecords({ fields: view3.fields }) : null;
    const subQueryResult3 = subview3 ? subview3.selectRecords({ fields: subview3.fields }) : null;  

    // Check if user can update globalConfig without knowing key or value
    const canUpdateGlobalConfig = globalConfig.checkPermissionsForSet();

    return {
        canUpdateGlobalConfig,

        table1,
        view1,
        fieldShape1,
        subview1,
        embedFieldLink1,
        embedFieldTable1,
        embedReverseFieldId1,
        queryResult1,
        subQueryResult1,
        

        table2,
        view2,
        fieldShape2,
        subview2,
        embedFieldLink2,
        embedFieldTable2,
        embedReverseFieldId2,
        queryResult2,
        subQueryResult2,

        table3,
        view3,
        fieldShape3,
        subview3,
        embedFieldLink3,
        embedFieldTable3,
        embedReverseFieldId3,
        queryResult3,
        subQueryResult3,

        chartOrientation: rawSettings.chartOrientation,
        linkStyle: rawSettings.linkStyle,

        table1ShapeAs: rawSettings.table1ShapeAs,
        table1Shape: rawSettings.table1Shape,
        table1Rounded: rawSettings.table1Rounded,
        table1ColourBy: rawSettings.table1ColourBy,
        table1Colour: rawSettings.table1Colour,
        table1IncludeFields: rawSettings.table1IncludeFields,
        table1ClusterByFieldId : rawSettings.table1ClusterByFieldId,
        table2ShapeAs: rawSettings.table2ShapeAs,
        table2Shape: rawSettings.table2Shape,
        table2Rounded: rawSettings.table2Rounded,
        table2ColourBy: rawSettings.table2ColourBy,
        table2Colour: rawSettings.table2Colour,
        table2IncludeFields: rawSettings.table2IncludeFields,
        table2ClusterByFieldId : rawSettings.table2ClusterByFieldId,
        table3ShapeAs: rawSettings.table3ShapeAs,
        table3Shape: rawSettings.table3Shape,
        table3Rounded: rawSettings.table3Rounded,
        table3ColourBy: rawSettings.table3ColourBy,
        table3Colour: rawSettings.table3Colour,
        table3IncludeFields: rawSettings.table3IncludeFields,
        table3ClusterByFieldId : rawSettings.table3ClusterByFieldId,
    };
}

function AorB(a, b) {
    if (a == undefined || a == null || a == "") {
        return b;
    }
    return a;
}

/**
 * Wraps the settings with validation information
 * @param {object} settings - The object returned by getSettings
 * @returns {{settings: object, isValid: boolean} | {settings: object, isValid: boolean, message: string}}
 */
function getSettingsValidationResult(settings) {
    const { queryResult1 } = settings;
    if (!queryResult1) {
        return {
            isValid: false,
            message: 'Pick a table and view',
            settings: settings,
        };
    }
    return {
        isValid: true,
        settings: settings,
    };
}


/**
 * A React hook to validate and access settings configured in SettingsForm.
 * @returns {{settings: object, isValid: boolean, message: string} | {settings: object, isValid: boolean}}
 */
export function useSettings(base) {
    const globalConfig = useGlobalConfig();
    const rawSettings = getRawSettingsWithDefaults(globalConfig);
    const settings = getSettings(rawSettings, base, globalConfig);
    return getSettingsValidationResult(settings);
}

export const allowedFieldTypes = [FieldType.FORMULA, FieldType.SINGLE_LINE_TEXT, FieldType.SINGLE_SELECT];

