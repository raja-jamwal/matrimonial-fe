import * as React from 'react';
import { Keyboard, StyleSheet, TextInput, View } from 'react-native';
import GlobalStyles from '../../styles/global';
import Text, { Value } from '../text';
import TagSelector from '../tag-selector/tag-selector';
import { getLogger } from '../../utils/logger';
import RNPickerSelect from 'react-native-picker-select';
import { WORLD_OPTION, WorldSelectorField } from '../world-selector';
import Color from '../../constants/Colors';
import AboutField from '../about-field';
import TouchableBtn from '../touchable-btn/touchable-btn';
import DateTime from '../date-time-ios/date-time-ios';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { find } from 'lodash';

interface IPROPS {
	navObject: any;
	mapping: any;
	updateAction: (object: any) => any;
	updateLabel?: string;
}

export function EditableForm({ navObject, mapping, updateAction, updateLabel }: IPROPS) {
	const logger = getLogger(EditableForm);
	const [showSubmissionFooter, setShowSubmissionFooter] = React.useState(true);
	const [object, setObject] = React.useState(navObject);

	let keyboardEventListeners = [] as any;

	React.useEffect(() => {
		keyboardEventListeners = [
			Keyboard.addListener('keyboardDidShow', handleShowSubmissionFooter(false)),
			Keyboard.addListener('keyboardDidHide', handleShowSubmissionFooter(true))
		];

		return () => {
			keyboardEventListeners.forEach(eventListener => eventListener.remove());
		};
	}, []);

	const handleShowSubmissionFooter = (showSubmissionFooter: boolean) => {
		return () => setShowSubmissionFooter(showSubmissionFooter);
	};

	const updateFieldValue = (
		field: string,
		value: any,
		onUpdateFunc?: (o: any, v: any) => any
	) => {
		if (field) {
			object[field] = value;
			let updatedObject = { ...object };
			if (onUpdateFunc) {
				const updatedResult = onUpdateFunc(updatedObject, value);
				if (updatedResult) {
					updatedObject = updatedResult;
				}
			}
			setObject({ ...updatedObject });
		}
	};

	const renderDateTimePicker = (
		field: string,
		renderString: string,
		dateOnly: boolean = true
	) => {
		let date = new Date(1993, 0, 1);
		if (!!renderString) {
			// unix epoch to ts
			date = new Date(parseInt(renderString) * 1000);
		}
		return (
			<DateTime
				epoch={date.getTime() / 1000}
				dateOnly={dateOnly}
				field={field}
				updateFieldValue={(field, epoch) => updateFieldValue(field, epoch)}
			/>
		);
	};

	const renderChoiceField = (options: any, value: string) => {
		const option = find(options, { value }) as any;
		if (!option) return '';
		return option.label;
	};

	const renderFields = () => {
		const fields = Object.keys(mapping).map(field => {
			const fieldDefinition = mapping[field];

			if (!fieldDefinition) return null;

			const value = object[field];
			let additionalProps = {};
			const type = fieldDefinition.type;

			const onUpdateFunc = fieldDefinition['onUpdate'];
			const propsFunction = fieldDefinition['props'];
			let shouldShowFunction = fieldDefinition['shouldShow'];
			let shouldShow = true;
			if (shouldShowFunction) {
				shouldShow = shouldShowFunction(object);
			}

			if (!shouldShow) return null;

			if (propsFunction) {
				const props = propsFunction(object);
				additionalProps = Object.assign({}, additionalProps, props);
			}

			const isFieldDisabled = field === 'phoneNumber';
			const isBooleanField = type === 'bool';
			const isAboutField = type === 'about';
			const isStringField = type === 'string';
			const isChoiceField = type === 'choice';
			const isNumberField = type === 'number';
			const isDateField = type === 'date';
			const isDateTimeField = type === 'date-time';
			const isCountryField = type === 'country';
			const isStateField = type === 'state';
			const isCityField = type === 'city';
			const isCityOnlyField = type === 'city-only';
			const isTagArray = type === 'tag-array';
			const tagType = isTagArray && fieldDefinition.tagType;

			const choiceFieldLabel = fieldDefinition.label;
			const isChoiceFieldValuePlaceholder =
				isChoiceField && (!value || value === choiceFieldLabel);

			let renderString = null;
			let stringEditable = false;

			let renderWorldValue = '';

			switch (type) {
				case 'about':
				case 'string':
					renderString = value && value.toString();
					stringEditable = true;
					break;
				case 'bool':
					renderString = value ? 'Yes' : 'No';
					stringEditable = false;
					break;
				case 'country':
				case 'state':
				case 'city':
				case 'city-only':
					renderWorldValue = (value && value.name) || '';
					break;
				default:
					renderString = value;
					break;
			}

			const choiceOptions = isChoiceField && fieldDefinition.choice.options;
			if (!!fieldDefinition.isNotEditable) {
				return (
					<View key={field}>
						<Value style={styles.fieldLabel}>{fieldDefinition.label}</Value>
						{isChoiceField && (
							<Value style={styles.fieldLabel}>
								{renderChoiceField(choiceOptions, renderString)}
							</Value>
						)}
						{!isChoiceField && <Value style={styles.fieldLabel}>{renderString}</Value>}
					</View>
				);
			}
			return (
				<View key={field}>
					<Value style={styles.fieldLabel}>{fieldDefinition.label}</Value>
					{isStringField && (
						<View style={styles.textField}>
							<TextInput
								onChangeText={text => updateFieldValue(field, text)}
								placeholder={fieldDefinition.label}
								value={renderString}
								style={styles.fieldText}
								editable={!isFieldDisabled}
							/>
						</View>
					)}
					{isAboutField && (
						<AboutField
							value={renderString}
							onChangeText={text => updateFieldValue(field, text)}
						/>
					)}
					{isNumberField && (
						<View style={styles.textField}>
							<TextInput
								keyboardType="numeric"
								onChangeText={text => updateFieldValue(field, text)}
								placeholder={fieldDefinition.label}
								value={value && value.toString()}
								style={styles.fieldText}
							/>
						</View>
					)}
					{isTagArray && (
						<View>
							<TagSelector
								tagType={tagType}
								currentTags={value}
								updateTags={(tags: Array<Tag>) => {
									updateFieldValue(field, [].concat(tags));
								}}
								title={fieldDefinition.label}
							/>
						</View>
					)}
					{isBooleanField && (
						<View style={styles.choiceField}>
							<RNPickerSelect
								value={!!value}
								useNativeAndroidPickerStyle={false}
								onValueChange={itemValue => updateFieldValue(field, itemValue)}
								items={[
									{
										label: 'Yes',
										value: true
									},
									{
										label: 'No',
										value: false
									}
								]}
								textInputProps={{
									style: {
										color: 'black',
										height: 50,
										padding: 8,
										fontSize: 16
									}
								}}
								placeholderTextColor={Color.primaryDarkColor}
							/>
						</View>
					)}
					{isDateField && renderDateTimePicker(field, renderString, true)}
					{isDateTimeField && renderDateTimePicker(field, renderString, false)}
					{isChoiceField && (
						<View style={styles.choiceField}>
							<RNPickerSelect
								value={value}
								useNativeAndroidPickerStyle={false}
								onValueChange={itemValue => updateFieldValue(field, itemValue)}
								items={choiceOptions}
								textInputProps={{
									style: {
										color: isChoiceFieldValuePlaceholder
											? Color.borderColor
											: Color.black,
										height: 50,
										padding: 8,
										fontSize: 16
									}
								}}
								placeholder={{
									label: choiceFieldLabel,
									value: null,
									color: Color.offWhite
								}}
								placeholderTextColor={Color.offWhite}
							/>
						</View>
					)}
					{isCountryField && (
						<WorldSelectorField
							options={[WORLD_OPTION.COUNTRY]}
							onSelect={selection => {
								if (!selection || !selection.country) {
									return;
								}
								updateFieldValue(field, selection.country, onUpdateFunc);
							}}
							value={renderWorldValue}
							{...additionalProps}
						/>
					)}
					{isStateField && (
						<WorldSelectorField
							options={[WORLD_OPTION.STATE]}
							onSelect={selection => {
								if (!selection || !selection.state) {
									return;
								}
								updateFieldValue(field, selection.state);
							}}
							value={renderWorldValue}
							{...additionalProps}
						/>
					)}
					{isCityField && (
						<WorldSelectorField
							options={[WORLD_OPTION.CITY]}
							onSelect={selection => {
								if (!selection || !selection.city) {
									return;
								}
								updateFieldValue(field, selection.city);
							}}
							value={renderWorldValue}
							{...additionalProps}
						/>
					)}
					{isCityOnlyField && (
						<WorldSelectorField
							options={[WORLD_OPTION.COUNTRY, WORLD_OPTION.STATE, WORLD_OPTION.CITY]}
							onSelect={selection => {
								if (!selection || !selection.city) {
									return;
								}
								updateFieldValue(field, selection.city);
							}}
							value={renderWorldValue}
							{...additionalProps}
						/>
					)}
				</View>
			);
		});
		return <View style={styles.formGroup}>{fields}</View>;
	};

	return (
		<View style={GlobalStyles.expand}>
			<KeyboardAwareScrollView style={[GlobalStyles.expand, styles.formContainer]}>
				{renderFields()}
			</KeyboardAwareScrollView>
			{showSubmissionFooter && (
				<View style={styles.submissionFooter}>
					<TouchableBtn onPress={() => updateAction(object)}>
						<Text style={styles.submissionBtn}>
							{updateLabel || 'Update Information'}
						</Text>
					</TouchableBtn>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	formContainer: {
		padding: 8,
		paddingTop: 0
	},
	formGroup: {
		paddingBottom: 30
	},
	fieldLabel: {
		paddingTop: 14,
		paddingBottom: 4,
		fontSize: 16
	},
	fieldText: {
		height: 35,
		fontSize: 16
	},
	textField: {
		borderColor: Color.borderColor,
		borderWidth: 1,
		paddingLeft: 8,
		paddingRight: 8,
		paddingTop: 6,
		paddingBottom: 6,
		borderRadius: 4
	},
	choiceField: {
		borderColor: Color.borderColor,
		borderWidth: 1,
		borderRadius: 4,
		flexDirection: 'column',
		justifyContent: 'center'
	},
	submissionFooter: {
		backgroundColor: 'white',
		padding: 8,
		borderTopWidth: 1,
		borderColor: Color.tabIconDefault
	},
	submissionBtn: {
		backgroundColor: Color.primaryDarkColor,
		padding: 6,
		textAlign: 'center',
		color: 'white',
		margin: 4,
		borderRadius: 4,
		fontSize: 16
	},
	labelContainer: {
		borderColor: Color.borderColor,
		borderStyle: 'solid',
		borderWidth: 1,
		paddingLeft: 8,
		paddingRight: 8,
		paddingTop: 12,
		paddingBottom: 12,
		borderRadius: 4
	},
	label: {
		fontSize: 16
	},
	placeholder: {
		color: Color.borderColor
	}
});
