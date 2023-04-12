import React from 'react';
import {
	Box,
	Button,
	FieldPickerSynced,
	FormField,
	Heading,
	Label,
	Link,
	InputSynced,
	SelectButtonsSynced,
	SelectSynced,
	TablePickerSynced,
	Text,
	SwitchSynced,
	ViewPickerSynced,
} from '@airtable/blocks/ui';
import { FieldType } from '@airtable/blocks/models';
import { ExportType } from './index';
import { allowedFieldTypes, ConfigKeys, LinkStyle, ChartOrientation, RecordShape, ShapeAs, ColourBy } from './settings';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { globalConfig } from '@airtable/blocks';

function SettingsForm({ setIsSettingsVisible, settingsValidationResult, onExportGraph }) {
	function table1Changed(event) {
		const updates = [
			{ path: [ConfigKeys.VIEW1_ID], value: null },
			{ path: [ConfigKeys.TABLE1_SHAPE_FIELD_ID], value: null },
			{ path: [ConfigKeys.TABLE1_EMBED_FIELDLINK], value: null },
			{ path: [ConfigKeys.TABLE1_EMBED_FIELDVIEW_ID], value: null },
			{ path: [ConfigKeys.TABLE1_CLUSTER_BY_FIELD], value: null },
			{ path: [ConfigKeys.TABLE1_COLOUR_BY], value: null }
		];
		if (globalConfig.hasPermissionToSetPaths(updates)) {
			globalConfig.setPathsAsync(updates);
		}
	}

	function table2Changed(event) {
		const updates = [
			{ path: [ConfigKeys.VIEW2_ID], value: null },
			{ path: [ConfigKeys.TABLE2_SHAPE_FIELD_ID], value: null },
			{ path: [ConfigKeys.TABLE2_EMBED_FIELDLINK], value: null },
			{ path: [ConfigKeys.TABLE2_EMBED_FIELDVIEW_ID], value: null },
			{ path: [ConfigKeys.TABLE2_CLUSTER_BY_FIELD], value: null },
			{ path: [ConfigKeys.TABLE2_COLOUR_BY], value: null }
		];
		if (globalConfig.hasPermissionToSetPaths(updates)) {
			globalConfig.setPathsAsync(updates);
		}
	}

	function table3Changed(event) {
		const updates = [
			{ path: [ConfigKeys.VIEW3_ID], value: null },
			{ path: [ConfigKeys.TABLE3_SHAPE_FIELD_ID], value: null },
			{ path: [ConfigKeys.TABLE3_EMBED_FIELDLINK], value: null },
			{ path: [ConfigKeys.TABLE3_EMBED_FIELDVIEW_ID], value: null },
			{ path: [ConfigKeys.TABLE3_CLUSTER_BY_FIELD], value: null },
			{ path: [ConfigKeys.TABLE3_COLOUR_BY], value: null }
		];
		if (globalConfig.hasPermissionToSetPaths(updates)) {
			globalConfig.setPathsAsync(updates);
		}
	}
	const { settings, isValid } = settingsValidationResult;

	return (
		<Box
			flex="none"
			display="flex"
			flexDirection="column"
			width="350px"
			padding={1}
			backgroundColor="white"
			overflowY="auto"
		>
			<Heading marginBottom={3}>Settings</Heading>
			<Tabs>
				<TabList>
					<Tab>Common</Tab>
					<Tab>Tab 1</Tab>
					<Tab>Tab 2</Tab>
					<Tab>Tab 3</Tab>
					<Tab>Export</Tab>
				</TabList>
				<TabPanel>
					<FormField
						label="Chart orientation"
						description={`Unlinked records will be ${settings.chartOrientation === ChartOrientation.HORIZONTAL
							? ChartOrientation.VERTICAL
							: ChartOrientation.HORIZONTAL
							}`}
					>
						<SelectButtonsSynced
							options={[
								{ label: 'Vertical', value: ChartOrientation.VERTICAL },
								{ label: 'Horizontal', value: ChartOrientation.HORIZONTAL },
							]}
							globalConfigKey={ConfigKeys.CHART_ORIENTATION}
						/>
					</FormField>
					<FormField label="Link style">
						<SelectButtonsSynced
							options={[
								{ label: 'Right angles', value: LinkStyle.RIGHT_ANGLES },
								{ label: 'Straight lines', value: LinkStyle.STRAIGHT_LINES },
								{ label: 'Curved lines', value: LinkStyle.CURVED_LINES },
							]}
							globalConfigKey={ConfigKeys.LINK_STYLE}
						/>
					</FormField>
				</TabPanel>
				<TabPanel>
					<Box
					>
						<FormField label="Table 1">
							<TablePickerSynced globalConfigKey={ConfigKeys.TABLE1_ID} onChange={table1Changed} />
						</FormField>
						{settings.table1 && (
							<Box>
								<FormField label="View 1">
									<ViewPickerSynced
										table={settings.table1}
										globalConfigKey={ConfigKeys.VIEW1_ID}
									/>
								</FormField>
								<FormField
									label="Table 1 Shape As"
									description={`Records will be ${settings.table1ShapeAs === ShapeAs.FIXEDSHAPE
										? "specified shape"
										: "dependent on field value"
										}`}
								>
									<SelectButtonsSynced
										options={[
											{ label: 'Field', value: ShapeAs.FIELDSHAPE },
											{ label: 'Fixed', value: ShapeAs.FIXEDSHAPE },
										]}
										globalConfigKey={ConfigKeys.TABLE1_SHAPE_AS}
									/>
								</FormField>
								{settings.table1ShapeAs === ShapeAs.FIXEDSHAPE &&
									<FormField label="Table 1 Shape">
										<SelectSynced
											options={[
												{ label: 'Pick a shape...', value: null, disabled: true },
												{ label: 'Rectangle', value: RecordShape.RECTANGLE },
												{ label: 'Ellipse', value: RecordShape.ELLIPSE },
												{ label: 'Circle', value: RecordShape.CIRCLE },
												{ label: 'Diamond', value: RecordShape.DIAMOND },
											]}
											globalConfigKey={ConfigKeys.TABLE1_SHAPE}
										/>
									</FormField>}
								{settings.table1ShapeAs === ShapeAs.FIELDSHAPE &&
									<FormField
										label="Linked record field"
										description="Field must contain valid node shape"
									>
										<FieldPickerSynced
											table={settings.table1}
											globalConfigKey={ConfigKeys.TABLE1_SHAPE_FIELD_ID}
											allowedTypes={allowedFieldTypes}
										/>
									</FormField>}
								<FormField label="Table1 Shape Rounded">
									<SwitchSynced
										label={`Shapes are ${settings.table1Rounded ? "" : "not "}rounded`}
										globalConfigKey={ConfigKeys.TABLE1_SHAPE_ROUNDED}
									/>
								</FormField>
								<FormField
									label="Table 1 Colour By"
									description={`Records will be ${settings.table1ColourBy}`}
								>
									<SelectButtonsSynced
										options={[
											{ label: 'Fixed', value: ColourBy.FIXEDCOLOUR },
											{ label: 'Record', value: ColourBy.RECORDCOLOUR },
										]}
										globalConfigKey={ConfigKeys.TABLE1_COLOUR_BY}
									/>
								</FormField>
								{settings.table1ColourBy == ColourBy.RECORDCOLOUR && <Text variant="paragraph" textColor="light">
									Record coloring is{' '}
									<Link
										href="https://support.airtable.com/hc/en-us/articles/115013883908-Record-coloring-overview"
										target="_blank"
									>
										based on the view
									</Link>
								</Text>}
								{settings.table1ColourBy === ColourBy.FIXEDCOLOUR &&
									<FormField label="Table 1 Colour">
										<InputSynced
											placeholder="a value from the SVG color scheme"
											globalConfigKey={ConfigKeys.TABLE1_COLOUR}
										/>
									</FormField>}
								<FormField label="Table1 Include Fields">
									<SwitchSynced
										label="View fields in grid"
										value={settings.table1IncludeFields}
										globalConfigKey={ConfigKeys.TABLE1_INCLUDE_FIELDS}
									/>
								</FormField>
								<FormField
									label="Embed linked record field"
									description="Field must be a link to a tab"
								>
									<FieldPickerSynced
										table={settings.table1}
										globalConfigKey={ConfigKeys.TABLE1_EMBED_FIELDLINK}
										shouldAllowPickingNone={true}
										allowedTypes={[FieldType.MULTIPLE_RECORD_LINKS]}
									/>
								</FormField>
								{settings.embedFieldLink1 && <FormField label="Embed linked record field view">
									<ViewPickerSynced
										table={settings.embedFieldTable1}
										globalConfigKey={ConfigKeys.TABLE1_EMBED_FIELDVIEW_ID}
									/>
								</FormField>}
								<FormField
									label="Cluster by field"
									description="Field contains a single cluster name"
								>
									<FieldPickerSynced
										table={settings.table1}
										globalConfigKey={ConfigKeys.TABLE1_CLUSTER_BY_FIELD}
										shouldAllowPickingNone={true}
										allowedTypes={allowedFieldTypes}
									/>
								</FormField>
							</Box>
						)}
					</Box>
				</TabPanel>
				<TabPanel>
					{!(settings.table1 && settings.view1) && (
						<span>Add a Tab 1 table first</span>
					)}
					{settings.table1 && settings.view1 && (
						<FormField label="Table 2">
							<TablePickerSynced globalConfigKey={ConfigKeys.TABLE2_ID} shouldAllowPickingNone={true} onChange={table2Changed} />
						</FormField>
					)}
					{settings.table1 && settings.table2 && (
						<Box>
							<FormField label="View 2">
								<ViewPickerSynced
									table={settings.table2}
									globalConfigKey={ConfigKeys.VIEW2_ID}
								/>
							</FormField>
							<FormField
								label="Table 2 Shape As"
								description={`Records will be ${settings.table2ShapeAs === ShapeAs.FIXEDSHAPE
									? "specified shape"
									: "dependent on field value"
									}`}
							>
								<SelectButtonsSynced
									options={[
										{ label: 'Field', value: ShapeAs.FIELDSHAPE },
										{ label: 'Fixed', value: ShapeAs.FIXEDSHAPE },
									]}
									globalConfigKey={ConfigKeys.TABLE2_SHAPE_AS}
								/>
							</FormField>
							{settings.table2ShapeAs === ShapeAs.FIXEDSHAPE &&
								<FormField label="Table 2 Shape">
									<SelectSynced
										options={[
											{ label: 'Pick a shape...', value: null, disabled: true },
											{ label: 'Rectangle', value: RecordShape.RECTANGLE },
											{ label: 'Ellipse', value: RecordShape.ELLIPSE },
											{ label: 'Circle', value: RecordShape.CIRCLE },
											{ label: 'Diamond', value: RecordShape.DIAMOND },
										]}
										globalConfigKey={ConfigKeys.TABLE2_SHAPE}
									/>
								</FormField>}
							{settings.table2ShapeAs === ShapeAs.FIELDSHAPE &&
								<FormField
									label="Linked record field"
									description="Field must contain valid node shape"
								>
									<FieldPickerSynced
										table={settings.table2}
										globalConfigKey={ConfigKeys.TABLE2_SHAPE_FIELD_ID}
										allowedTypes={allowedFieldTypes}
									/>
								</FormField>}
							<FormField label="Table2 Shape Rounded">
								<SwitchSynced
									label={`Shapes are ${settings.table2Rounded ? "" : "not "}rounded`}
									value={settings.table2Rounded}
									globalConfigKey={ConfigKeys.TABLE2_SHAPE_ROUNDED}
								/>
							</FormField>
							<FormField
								label="Table 2 Colour By"
								description={`Records will be ${settings.table2ColourBy}`}
							>
								<SelectButtonsSynced
									options={[
										{ label: 'Fixed', value: ColourBy.FIXEDCOLOUR },
										{ label: 'Record', value: ColourBy.RECORDCOLOUR },
									]}
									globalConfigKey={ConfigKeys.TABLE2_COLOUR_BY}
								/>
							</FormField>
							{settings.table2ColourBy == ColourBy.RECORDCOLOUR && <Text variant="paragraph" textColor="light">
								Record coloring is{' '}
								<Link
									href="https://support.airtable.com/hc/en-us/articles/115013883908-Record-coloring-overview"
									target="_blank"
								>
									based on the view
								</Link>
							</Text>}
							{settings.table2ColourBy === ColourBy.FIXEDCOLOUR &&
								<FormField label="Table 2 Colour">
									<InputSynced
										placeholder="a value from the SVG color scheme"
										globalConfigKey={ConfigKeys.TABLE2_COLOUR}
									/>
								</FormField>}
							<FormField label="Table2 Include Fields">
								<SwitchSynced
									label="View fields in grid"
									value={settings.table2IncludeFields}
									globalConfigKey={ConfigKeys.TABLE2_INCLUDE_FIELDS}
								/>
							</FormField>
							<FormField
								label="Embed linked record field"
								description="Field must be a link to a tab"
							>
								<FieldPickerSynced
									table={settings.table2}
									globalConfigKey={ConfigKeys.TABLE2_EMBED_FIELDLINK}
									allowedTypes={[FieldType.MULTIPLE_RECORD_LINKS]}
								/>
							</FormField>
							{settings.embedFieldLink2 && <FormField label="Embed linked record field view">
								<ViewPickerSynced
									table={settings.embedFieldTable2}
									globalConfigKey={ConfigKeys.TABLE2_EMBED_FIELDVIEW_ID}
								/>
							</FormField>}
							<FormField
								label="Cluster by field"
								description="Field contains a single cluster name"
							>
								<FieldPickerSynced
									table={settings.table2}
									globalConfigKey={ConfigKeys.TABLE2_CLUSTER_BY_FIELD}
									shouldAllowPickingNone={true}
									allowedTypes={allowedFieldTypes}
								/>
							</FormField>
						</Box>
					)}
				</TabPanel>
				<TabPanel>
					{!(settings.table1 && settings.view1 && settings.table2 && settings.view2) && (
						<span>Add a Tab 2 table first</span>
					)}
					{settings.table1 && settings.view1 && settings.table2 && settings.view2 && (
						<FormField label="Table 3">
							<TablePickerSynced globalConfigKey={ConfigKeys.TABLE3_ID} shouldAllowPickingNone={true} onChange={table3Changed} />
						</FormField>
					)}
					{settings.table1 && settings.view1 && settings.table2 && settings.view2 && settings.table3 && (
						<Box>
							<FormField label="View 3">
								<ViewPickerSynced
									table={settings.table3}
									globalConfigKey={ConfigKeys.VIEW3_ID}
								/>
							</FormField>
							<FormField
								label="Table 3 Shape As"
								description={`Records will be ${settings.table3ShapeAs === ShapeAs.FIXEDSHAPE
									? "specified shape"
									: "dependent on field value"
									}`}
							>
								<SelectButtonsSynced
									options={[
										{ label: 'Field', value: ShapeAs.FIELDSHAPE },
										{ label: 'Fixed', value: ShapeAs.FIXEDSHAPE },
									]}
									globalConfigKey={ConfigKeys.TABLE3_SHAPE_AS}
								/>
							</FormField>
							{settings.table3ShapeAs === ShapeAs.FIXEDSHAPE &&
								<FormField label="Table 3 Shape">
									<SelectSynced
										options={[
											{ label: 'Pick a shape...', value: null, disabled: true },
											{ label: 'Rectangle', value: RecordShape.RECTANGLE },
											{ label: 'Ellipse', value: RecordShape.ELLIPSE },
											{ label: 'Circle', value: RecordShape.CIRCLE },
											{ label: 'Diamond', value: RecordShape.DIAMOND },
										]}
										globalConfigKey={ConfigKeys.TABLE3_SHAPE}
									/>
								</FormField>}
							{settings.table3ShapeAs === ShapeAs.FIELDSHAPE &&
								<FormField
									label="Linked record field"
									description="Field must contain valid node shape"
								>
									<FieldPickerSynced
										table={settings.table3}
										globalConfigKey={ConfigKeys.TABLE3_SHAPE_FIELD_ID}
										allowedTypes={allowedFieldTypes}
									/>
								</FormField>}
							<FormField label="Table 3 Shape Rounded">
								<SwitchSynced
									label={`Shapes are ${settings.table3Rounded ? "" : "not "}rounded`}
									value={settings.table3Rounded}
									globalConfigKey={ConfigKeys.TABLE3_SHAPE_ROUNDED}
								/>
							</FormField>
							<FormField
								label="Table 3 Colour By"
								description={`Records will be ${settings.table3ColourBy}`}
							>
								<SelectButtonsSynced
									options={[
										{ label: 'Fixed', value: ColourBy.FIXEDCOLOUR },
										{ label: 'Record', value: ColourBy.RECORDCOLOUR },
									]}
									globalConfigKey={ConfigKeys.TABLE3_COLOUR_BY}
								/>
							</FormField>
							{settings.table3ColourBy == ColourBy.RECORDCOLOUR && <Text variant="paragraph" textColor="light">
								Record coloring is{' '}
								<Link
									href="https://support.airtable.com/hc/en-us/articles/115013883908-Record-coloring-overview"
									target="_blank"
								>
									based on the view
								</Link>
							</Text>}
							{settings.table3ColourBy === ColourBy.FIXEDCOLOUR &&
								<FormField label="Table 3 Colour">
									<InputSynced
										placeholder="a value from the SVG color scheme"
										globalConfigKey={ConfigKeys.TABLE3_COLOUR}
									/>
								</FormField>}
							<FormField label="Table 3 Include Fields">
								<SwitchSynced
									label="View fields in grid"
									value={settings.table3IncludeFields}
									globalConfigKey={ConfigKeys.TABLE3_INCLUDE_FIELDS}
								/>
							</FormField>
							<FormField
								label="Embed linked record field"
								description="Field must be a link to a tab"
							>
								<FieldPickerSynced
									table={settings.table3}
									globalConfigKey={ConfigKeys.TABLE3_EMBED_FIELDLINK}
									allowedTypes={[FieldType.MULTIPLE_RECORD_LINKS]}
								/>
							</FormField>
							{settings.embedFieldLink3 && <FormField label="Embed linked record field view">
								<ViewPickerSynced
									table={settings.embedFieldTable3}
									globalConfigKey={ConfigKeys.TABLE3_EMBED_FIELDVIEW_ID}
								/>
							</FormField>}
							<FormField
								label="Cluster by field"
								description="Field contains a single cluster name"
							>
								<FieldPickerSynced
									table={settings.table3}
									globalConfigKey={ConfigKeys.TABLE3_CLUSTER_BY_FIELD}
									shouldAllowPickingNone={true}
									allowedTypes={allowedFieldTypes}
								/>
							</FormField>
						</Box>
					)}
				</TabPanel>
				<TabPanel>
					<Box
						flex="none"
						display="flex"
						justifyContent="space-between"
						paddingY={3}
						marginX={3}
						borderTop="thick"
					>
						<Box display="flex" alignItems="center">
							<Label marginRight={2} marginBottom={0}>
								Export as
							</Label>
							<Button
								disabled={!isValid}
								onClick={() => onExportGraph(ExportType.SVG)}
								marginRight={2}
							>
								SVG
							</Button>
							<Button disabled={!isValid} onClick={() => onExportGraph(ExportType.PNG)}>
								PNG
							</Button>
						</Box>
					</Box>
				</TabPanel>
			</Tabs>
			<Button variant="primary" onClick={() => setIsSettingsVisible(false)}>
				Done
			</Button>
		</Box>
	);
}
export default SettingsForm;
