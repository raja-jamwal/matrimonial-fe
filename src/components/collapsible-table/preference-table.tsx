import * as React from 'react';
import CollapsibleTable from './index';
import { IRootState } from '../../store/index';
import { connect } from 'react-redux';
import { Preference } from '../../store/reducers/account-defination';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { updatePreference } from '../../store/reducers/user-profile-reducer';
import { Action } from 'redux-actions';
import { MaritalStatusOptions } from './profile-table';

interface IPreferenceTableProps {
	userProfileId: number;
	editable: boolean;
}
interface IPreferenceTableStateToProps {
	preference?: Preference;
}
interface IPreferenceTableMapDispatchToProps {
	updatePreference: () => any;
}

export const PreferenceEducationOptions = [
	{
		label: 'Administrative Services',
		value: 'admin-service'
	},
	{
		label: 'Advertising / Marketing',
		value: 'advert-market'
	},
	{
		label: 'Architect',
		value: 'architect'
	},
	{
		label: 'Army / Air Force / Navy',
		value: 'defense'
	},
	{
		label: 'Arts',
		value: 'arts'
	},
	{
		label: 'CA / ICWA / CS / CFA',
		value: 'ca'
	},
	{
		label: 'Commerce',
		value: 'commerce'
	},
	{
		label: 'Computer / IT',
		value: 'it'
	},
	{
		label: 'Education',
		value: 'education'
	},
	{
		label: 'Engineering / Technology',
		value: 'eng'
	},
	{
		label: 'Fashion',
		value: 'fashion'
	},
	{
		label: 'Finance',
		value: 'finance'
	},
	{
		label: 'Fine Arts',
		value: 'fine-art'
	},
	{
		label: 'Home Science',
		value: 'home-science'
	},
	{
		label: 'Hospitality / Hotel Management',
		value: 'hotel-mgmt'
	},
	{
		label: 'Law',
		value: 'law'
	},
	{
		label: 'Management',
		value: 'management'
	},
	{
		label: 'Medicine',
		value: 'medicine'
	},
	{
		label: 'Nursing / Health Science',
		value: 'health-science'
	},
	{
		label: 'Others',
		value: 'others'
	},
	{
		label: 'Pharmacology',
		value: 'pharma'
	},
	{
		label: 'Science',
		value: 'science'
	},
	{
		label: 'Social Sciences',
		value: 'social-science'
	},
	{
		label: 'UPSC / MPSC',
		value: 'upsc'
	}
];
export const PreferenceOccupationOptions = [
	{
		label: 'Business',
		value: 'business'
	},
	{
		label: 'CA / ICWA /CS',
		value: 'ca'
	},
	{
		label: 'Consultant',
		value: 'consultant'
	},
	{
		label: 'Dentist',
		value: 'dentist'
	},
	{
		label: 'Doctor',
		value: 'doctor'
	},
	{
		label: 'Employee',
		value: 'employee'
	},
	{
		label: 'Engineer / Architect',
		value: 'eng'
	},
	{
		label: 'Government Servant',
		value: 'gov-ser'
	},
	{
		label: 'Job Seeker',
		value: 'job-seeker'
	},
	{
		label: 'Lawyer',
		value: 'lawyer'
	},
	{
		label: 'Military Services',
		value: 'military'
	},
	{
		label: 'Other',
		value: 'other'
	},
	{
		label: 'Professionals',
		value: 'professional'
	},
	{
		label: 'Professor / Teacher',
		value: 'prof-teacher'
	},
	{
		label: 'Research Fellow',
		value: 'research'
	},
	{
		label: 'Self Employed',
		value: 'self'
	},
	{
		label: 'Service + Business',
		value: 'serv-bus'
	},
	{
		label: 'Student',
		value: 'student'
	}
];
export const PreferenceDietOptions = [
	{
		label: 'Veg',
		value: 'veg'
	},
	{
		label: 'Non-Veg Frequently',
		value: 'non-veg-freq'
	},
	{
		label: 'Eggetarian',
		value: 'eggetarian'
	},
	{
		label: 'Non-Veg Occasionally',
		value: 'non-veg-occa'
	},
	{
		label: 'Others (Jain, Vegan)',
		value: 'others'
	}
];
export const PreferenceSmokeOptions = [
	{
		label: 'Yes',
		value: 'yes'
	},
	{
		label: 'No',
		value: 'no'
	},
	{
		label: 'Occasionally',
		value: 'occasionally'
	}
];
export const PreferenceDrinkOptions = [
	{
		label: 'Yes',
		value: 'yes'
	},
	{
		label: 'No',
		value: 'no'
	},
	{
		label: 'Occasionally',
		value: 'occasionally'
	}
];
export const PreferenceHotelingOptions = [
	{
		label: 'Yes',
		value: 'yes'
	},
	{
		label: 'No',
		value: 'no'
	},
	{
		label: 'Occasionally',
		value: 'occasionally'
	}
];
export const PreferencePartyingOptions = [
	{
		label: 'Yes',
		value: 'yes'
	},
	{
		label: 'No',
		value: 'no'
	},
	{
		label: 'Occasionally',
		value: 'occasionally'
	}
];
export const PreferenceCookingOptions = [
	{
		label: 'Yes',
		value: 'yes'
	},
	{
		label: 'No',
		value: 'no'
	},
	{
		label: 'Occasionally',
		value: 'occasionally'
	}
];

class PreferenceTable extends React.Component<
	IPreferenceTableProps & IPreferenceTableMapDispatchToProps & IPreferenceTableStateToProps
> {
	mappings = {
		maritalStatus: {
			label: 'Marital Status',
			type: 'choice',
			choice: {
				options: MaritalStatusOptions
			}
		},
		caste: {
			label: 'Caste',
			tagType: 'caste',
			type: 'tag-array'
		},
		subCaste: {
			label: 'Sub Caste',
			tagType: 'sub_caste',
			type: 'tag-array'
		},
		differenceHeight: {
			label: 'Difference in height (cms)',
			type: 'string'
		},
		differenceAge: {
			label: 'Difference in Age',
			type: 'string'
		},
		educationLevel: {
			label: 'Education Level',
			tagType: 'education_level',
			type: 'tag-array'
		},
		education: {
			label: 'Education',
			type: 'choice',
			choice: {
				options: PreferenceEducationOptions
			}
		},
		mediumOfEducation: {
			label: 'Medium of Primary Education',
			type: 'choice',
			choice: {
				options: [
					{
						label: 'English',
						value: 'english'
					},
					{
						label: 'Gujrati',
						value: 'gujrati'
					},
					{
						label: 'Hindi',
						value: 'hindi'
					},
					{
						label: 'Kannada',
						value: 'kannada'
					},
					{
						label: 'Marathi',
						value: 'marathi'
					},
					{
						label: 'Marathi+English',
						value: 'mara_eng'
					},
					{
						label: 'Other',
						value: 'other'
					}
				]
			}
		},
		workingPartner: {
			label: 'Do you want a working partner',
			type: 'choice',
			choice: {
				options: [
					{
						label: 'Must',
						value: 'must'
					},
					{
						label: 'Preferred',
						value: 'preferred'
					},
					{
						label: 'No',
						value: 'no'
					}
				]
			}
		},
		occupation: {
			label: 'Occupation',
			type: 'choice',
			choice: {
				options: PreferenceOccupationOptions
			}
		},
		workCountry: {
			label: 'Work country',
			type: 'country'
		},
		workState: {
			label: 'Work state',
			type: 'state'
		},
		workCity: {
			label: 'Work city',
			type: 'city'
		},
		parentCountry: {
			label: 'Parent country',
			type: 'country'
		},
		parentState: {
			label: 'Parent state',
			type: 'state'
		},
		parentCity: {
			label: 'Parent city',
			type: 'city'
		},
		diet: {
			label: 'Diet',
			type: 'choice',
			choice: {
				options: PreferenceDietOptions
			}
		},
		smoke: {
			label: 'Smoke',
			type: 'choice',
			choice: {
				options: PreferenceSmokeOptions
			}
		},
		drink: {
			label: 'Drink',
			type: 'choice',
			choice: {
				options: PreferenceDrinkOptions
			}
		},
		hoteling: {
			label: 'Hoteling',
			type: 'choice',
			choice: {
				options: PreferenceHotelingOptions
			}
		},
		partying: {
			label: 'Partying / Pubbing',
			type: 'choice',
			choice: {
				options: PreferencePartyingOptions
			}
		},
		cooking: {
			label: 'Cooking',
			type: 'choice',
			choice: {
				options: PreferenceCookingOptions
			}
		},
		familyFinancialBackground: {
			label: 'Family Financial Background',
			tagType: 'financial_background',
			type: 'tag-array'
		},
		familyValues: {
			label: 'Family Values',
			tagType: 'family_value',
			type: 'tag-array'
		},
		specialCase: {
			label: 'Special Case',
			tagType: 'case',
			type: 'tag-array'
		},
		otherExpectations: {
			label: 'Other Expectations',
			type: 'string'
		}
		// we need to visit this again
		// hideProfileFrom: {
		// 	label: 'Do not Show Profile to',
		// 	type: 'string'
		// }
	};

	render() {
		const { preference, userProfileId, updatePreference, editable } = this.props;
		if (!preference) return null;
		return (
			<CollapsibleTable
				title="Partner Preferences"
				object={preference}
				mapping={this.mappings}
				updateAction={updatePreference}
				userProfileId={userProfileId}
				editable={editable}
			/>
		);
	}
}

const mapStateToProps = (initialState: IRootState, ownProps: IPreferenceTableProps) => {
	const profileId = ownProps.userProfileId;
	const profile = initialState.userProfiles[profileId];
	if (profile) {
		const preference = profile.preference;
		return {
			preference
		};
	}
	return {};
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
	return {
		updatePreference: bindActionCreators<Action<any>, any>(updatePreference, dispatch)
	};
};

export default connect<
	IPreferenceTableStateToProps,
	IPreferenceTableMapDispatchToProps,
	IPreferenceTableProps,
	IRootState
>(
	mapStateToProps,
	mapDispatchToProps
)(PreferenceTable);
