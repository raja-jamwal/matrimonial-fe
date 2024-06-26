import * as React from 'react';
import CollapsibleTable from './index';
import { View } from 'react-native';
import { Family } from '../../store/reducers/account-defination';
import { IRootState } from '../../store/index';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { Action } from 'redux-actions';
import {
	updateFamily,
	updateFamilyOtherInformation
} from '../../store/reducers/user-profile-reducer';
import { GenderOptions } from './profile-table';

interface IFamilyTableProps {
	userProfileId: number;
	editable: boolean;
}

interface IFamilyTableMapStateToProps {
	family?: Family;
}

interface IFamilyTableMapDispatchToProps {
	updateFamily: () => any;
	updateFamilyOtherInformation: () => any;
}

const ParentAliveOptions = [
	{
		label: 'Alive',
		value: 'alive'
	},
	{
		label: 'Expired',
		value: 'expired'
	}
];

export const FamilyMapping = {
	fatherName: {
		label: "Father's Name",
		type: 'string'
	},
	father: {
		label: 'Father (Alive/Expired)',
		type: 'choice',
		choice: {
			options: ParentAliveOptions
		}
	},
	fatherOccupation: {
		label: "Father's Occupation",
		type: 'string'
	},
	fatherDesignation: {
		label: "Father's Designation(Present/Last)",
		type: 'string'
	},
	fatherNativePlace: {
		label: "Father's Native Place",
		type: 'string'
	},
	motherName: {
		label: "Mother's Name",
		type: 'string'
	},
	mother: {
		label: 'Mother (Alive/Expired)',
		type: 'choice',
		choice: {
			options: ParentAliveOptions
		}
	},
	motherOccupation: {
		label: "Mothers's Occupation",
		type: 'string'
	},
	motherDesignation: {
		label: "Mothers's Designation(Present/Last)",
		type: 'string'
	},
	motherMaternalSurname: {
		label: "Mother's Maternal Surname",
		type: 'string'
	},
	motherNativePlace: {
		label: "Mother's Native Place",
		type: 'string'
	},
	noOfBrothers: {
		label: 'No. of Brother(s)',
		type: 'number'
	},
	brothersMarried: {
		label: 'Of which married',
		type: 'number'
	},
	noOfSisters: {
		label: 'No. of Sister(s)',
		type: 'number'
	},
	sistersMarried: {
		label: 'Of which married',
		type: 'number'
	},
	aboutFamily: {
		label: 'About Family',
		type: 'string'
	},
	familyCountry: {
		label: 'Family country',
		type: 'country',
		onUpdate: (object: any, value: any) => {
			object['familyState'] = null;
			object['familyCity'] = null;
			return object;
		}
	},
	familyState: {
		label: 'Family state',
		type: 'state',
		props: (object: any) => {
			let props = {};
			if (object.familyCountry) {
				props = Object.assign({}, props, {
					countryId: object.familyCountry.id
				});
			}
			return props;
		},
		shouldShow: (object: any) => {
			if (object.familyCountry) {
				return true;
			}

			return false;
		}
	},
	familyCity: {
		label: 'Family city',
		type: 'city',
		props: (object: any) => {
			let props = {};
			if (object.familyState) {
				props = Object.assign({}, props, {
					stateId: object.familyState.id
				});
			}
			return props;
		},
		shouldShow: (object: any) => {
			if (object.familyState) {
				return true;
			}

			return false;
		}
	},
	interCasteParents: {
		label: 'Inter caste marriage of Parents?',
		type: 'choice',
		choice: {
			options: [
				{
					label: 'Yes',
					value: 'yes'
				},
				{
					label: 'No',
					value: 'no'
				}
			]
		}
	},
	parentsLivingSeperately: {
		label: 'Parents living separately?',
		type: 'choice',
		choice: {
			options: [
				{
					label: 'Yes',
					value: 'yes'
				},
				{
					label: 'No',
					value: 'no'
				}
			]
		}
	}
};

class FamilyTable extends React.Component<
	IFamilyTableProps & IFamilyTableMapStateToProps & IFamilyTableMapDispatchToProps
> {
	otherInfoMapping = {
		familyValues: {
			label: 'Family values',
			tagType: 'family_value',
			type: 'tag-array'
		},
		familyFinancialBackground: {
			label: 'Family Financial Background',
			tagType: 'financial_background',
			type: 'tag-array'
		},
		familyAnnualIncome: {
			label: "Family's Annual Income",
			type: 'string'
		},
		home: {
			label: 'Home',
			type: 'string'
		},
		homeType: {
			label: 'Home Type',
			tagType: 'home_type',
			type: 'tag-array'
		},
		otherHomeType: {
			label: 'Other Home Type',
			tagType: 'home_type',
			type: 'tag-array'
		},
		realEstate: {
			label: 'Real Estate',
			tagType: 'real_estate',
			type: 'tag-array'
		},
		vehicle: {
			label: 'Vehicle',
			type: 'bool'
		},
		vehicleType: {
			label: 'Vehicle Type',
			tagType: 'vehicle_type',
			type: 'tag-array'
		},
		loans: {
			label: 'Loans',
			tagType: 'loan',
			type: 'tag-array'
		},
		otherLoans: {
			label: 'Loans / Financial Liabilities',
			type: 'string'
		},
		familyMedicalHistory: {
			label: "Family's Medical History",
			type: 'string'
		}
	};

	render() {
		const {
			family,
			userProfileId,
			updateFamily,
			updateFamilyOtherInformation,
			editable
		} = this.props;
		if (!family) return null;
		return (
			<View>
				<CollapsibleTable
					title="Family Information"
					object={family}
					mapping={FamilyMapping}
					updateAction={updateFamily}
					userProfileId={userProfileId}
					editable={editable}
				/>
				<CollapsibleTable
					title="Other Information"
					object={family.familyOtherInformation}
					mapping={this.otherInfoMapping}
					updateAction={updateFamilyOtherInformation}
					userProfileId={userProfileId}
					editable={editable}
				/>
			</View>
		);
	}
}

const mapStateToProps = (initialState: IRootState, ownProps: IFamilyTableProps) => {
	const profileId = ownProps.userProfileId;
	const profile = initialState.userProfiles[profileId];
	if (profile) {
		const family = profile.family;
		return {
			family
		};
	}
	return {};
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
	return {
		updateFamily: bindActionCreators<Action<any>, any>(updateFamily, dispatch),
		updateFamilyOtherInformation: bindActionCreators<Action<any>, any>(
			updateFamilyOtherInformation,
			dispatch
		)
	};
};

export default connect<
	IFamilyTableMapStateToProps,
	IFamilyTableMapDispatchToProps,
	IFamilyTableProps,
	IRootState
>(
	mapStateToProps,
	mapDispatchToProps
)(FamilyTable);
