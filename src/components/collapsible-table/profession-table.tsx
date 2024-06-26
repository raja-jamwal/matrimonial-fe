import * as React from 'react';
import CollapsibleTable from './index';
import { IRootState } from '../../store/index';
import { connect } from 'react-redux';
import { Profession } from '../../store/reducers/account-defination';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { updateProfession } from '../../store/reducers/user-profile-reducer';
import { Action } from 'redux-actions';

interface IProfessionTableProps {
	userProfileId: number;
	editable: boolean;
}
interface IProfessionTableMapStateToProps {
	profession?: Profession;
}
interface IProfessionTableMapDispatchToProps {
	updateProfession: () => any;
}

export const ProfessionTableIncomeOptions = [
	{
		label: 'Less than 3 Lakhs',
		value: 299999
	},
	{
		label: '3 Lakhs - 5 Lakhs',
		value: 450000
	},
	{
		label: '5 Lakhs - 10 Lakhs',
		value: 750000
	},
	{
		label: '10 Lakhs - 15 Lakhs',
		value: 1350000
	},
	{
		label: '15 Lakhs - 25 Lakhs',
		value: 2000000
	},
	{
		label: '25 Lakhs - 35 Lakhs',
		value: 3000000
	},
	{
		label: '35 Lakhs - 50 Lakhs',
		value: 4000000
	},
	{
		label: '50 Lakhs - 1 Crore',
		value: 7500000
	},
	{
		label: 'More than 1 Crore',
		value: 10000000
	}
];

export const ProfessionTableOccupationOptions = [
	{
		label: 'Business',
		value: 'business'
	},
	{
		label: 'CA/ICWA/CS',
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
		label: 'Engineer/Architect',
		value: 'engineer'
	},
	{
		label: 'Gov. Servant',
		value: 'gov'
	},
	{
		label: 'Jobseeker',
		value: 'job_seeker'
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
		value: 'professionals'
	},
	{
		label: 'Professor/Teacher',
		value: 'professor'
	},
	{
		label: 'Research fellow',
		value: 'research'
	},
	{
		label: 'Self Employed',
		value: 'self'
	},
	{
		label: 'Service+Business',
		value: 'service+business'
	},
	{
		label: 'Student',
		value: 'student'
	}
];
export const ProfessionTableWorkingFieldOptions = [
	{
		label: 'Research',
		value: 'research'
	},
	{
		label: 'Merchant navy',
		value: 'merchant_navy'
	},
	{
		label: 'Private Sector',
		value: 'private_sector'
	},
	{
		label: 'MNC',
		value: 'mnc'
	},
	{
		label: 'Govt./Publish',
		value: 'govt'
	},
	{
		label: 'Business/Self Employeed',
		value: 'business'
	},
	{
		label: 'Military / Defense',
		value: 'military'
	},
	{
		label: 'Professional',
		value: 'professional'
	},
	{
		label: 'Student',
		value: 'student'
	},
	{
		label: 'Jobseeker',
		value: 'jobseeker'
	},
	{
		label: 'Other',
		value: 'other'
	},
	{
		label: 'Scientist',
		value: 'scientist'
	}
];

export const ProfessionTableLengthOfEmploymentOptions = [
	{
		label: 'Less than a year',
		value: 11
	},
	{
		label: '1 Year - 2 Years',
		value: 18
	},
	{
		label: '2 Year - 5 Years',
		value: 48
	},
	{
		label: 'More than 5 Years',
		value: 49
	}
];

export const ProfessionMapping = {
	occupation: {
		label: 'Occupation',
		type: 'choice',
		choice: {
			options: ProfessionTableOccupationOptions
		}
	},
	// workingField: {
	// 	label: 'Working Field',
	// 	type: 'choice',
	// 	choice: {
	// 		options: ProfessionTableWorkingFieldOptions
	// 	}
	// },
	lengthOfEmployment: {
		label: 'Length of Employment',
		type: 'choice',
		choice: {
			options: ProfessionTableLengthOfEmploymentOptions
		}
	},
	company: {
		label: 'Company / Organisation name',
		type: 'string'
	},
	designation: {
		label: 'Designation',
		type: 'string'
	},
	// currency: {
	// 	label: 'Currency',
	// 	type: 'choice',
	// 	choice: {
	// 		options: [
	// 			{
	// 				label: 'Rupees',
	// 				value: 'rupees'
	// 			},
	// 			{
	// 				label: 'US Dollar',
	// 				value: 'us_dollar'
	// 			},
	// 			{
	// 				label: 'Euro',
	// 				value: 'euro'
	// 			},
	// 			{
	// 				label: 'Swiss Franc',
	// 				value: 'swiss_franc'
	// 			},
	// 			{
	// 				label: 'Australian Dollar',
	// 				value: 'aus_dollar'
	// 			},
	// 			{
	// 				label: 'Canadian Dollar',
	// 				value: 'can_dollar'
	// 			},
	// 			{
	// 				label: 'Emirati Dirham',
	// 				value: 'dirham'
	// 			},
	// 			{
	// 				label: 'Chinese Yuan Renminbi',
	// 				value: 'yuan'
	// 			},
	// 			{
	// 				label: 'Malaysian Ringgit',
	// 				value: 'ringgit'
	// 			},
	// 			{
	// 				label: 'New Zealand Dollar',
	// 				value: 'new_zealand_dollar'
	// 			},
	// 			{
	// 				label: 'British Pound',
	// 				value: 'pound'
	// 			},
	// 			{
	// 				label: 'Singapore Dollar',
	// 				value: 'singa_dollar'
	// 			},
	// 			{
	// 				label: 'Yen',
	// 				value: 'yen'
	// 			},
	// 			{
	// 				label: 'OMR',
	// 				value: 'omr'
	// 			},
	// 			{
	// 				label: 'Dinar',
	// 				value: 'dinar'
	// 			},
	// 			{
	// 				label: 'Krona',
	// 				value: 'krona'
	// 			},
	// 			{
	// 				label: 'Hongkong dollar',
	// 				value: 'hong_dollar'
	// 			},
	// 			{
	// 				label: 'Brazillan real',
	// 				value: 'real'
	// 			},
	// 			{
	// 				label: 'Saudi riyal',
	// 				value: 'riyal'
	// 			},
	// 			{
	// 				label: 'Peso',
	// 				value: 'peso'
	// 			},
	// 			{
	// 				label: 'Rand',
	// 				value: 'rand'
	// 			},
	// 			{
	// 				label: 'Qatari Rial',
	// 				value: 'rial'
	// 			},
	// 			{
	// 				label: 'Polish Zloty',
	// 				value: 'zloty'
	// 			},
	// 			{
	// 				label: 'MOP',
	// 				value: 'mop'
	// 			}
	// 		]
	// 	}
	// },
	// monthlyIncome: {
	// 	label: 'Monthly Income',
	// 	type: 'number'
	// },
	annualIncome: {
		label: 'Annual Income',
		type: 'choice',
		choice: {
			options: ProfessionTableIncomeOptions
		}
	},
	loans: {
		label: 'Loans / Financial Liabilities',
		tagType: 'loan',
		type: 'tag-array'
	},
	otherLoans: {
		label: 'Other loans',
		type: 'string'
	},
	workCountry: {
		label: 'Work Country',
		type: 'country',
		onUpdate: (object: any, _value: any) => {
			object['workState'] = null;
			object['workCity'] = null;
			return object;
		}
	},
	workState: {
		label: 'Work State',
		type: 'state',
		props: (object: any) => {
			let props = {};
			if (object.workCountry) {
				props = Object.assign({}, props, {
					countryId: object.workCountry.id
				});
			}
			return props;
		},
		shouldShow: (object: any) => {
			if (object.workCountry) {
				return true;
			}
			return false;
		}
	},
	workCity: {
		label: 'Work City',
		type: 'city',
		props: (object: any) => {
			let props = {};
			if (object.workState) {
				props = Object.assign({}, props, {
					stateId: object.workState.id
				});
			}
			return props;
		},
		shouldShow: (object: any) => {
			if (object.workState) {
				return true;
			}
			return false;
		}
	}
};
class ProfessionTable extends React.Component<
	IProfessionTableProps & IProfessionTableMapDispatchToProps & IProfessionTableMapStateToProps
> {
	render() {
		const { profession, userProfileId, updateProfession, editable } = this.props;
		if (!profession) return null;
		return (
			<CollapsibleTable
				title="Professional Information"
				object={profession}
				mapping={ProfessionMapping}
				updateAction={updateProfession}
				userProfileId={userProfileId}
				editable={editable}
			/>
		);
	}
}

const mapStateToProps = (initialState: IRootState, ownProps: IProfessionTableProps) => {
	const profileId = ownProps.userProfileId;
	const profile = initialState.userProfiles[profileId];
	if (profile) {
		const profession = profile.profession;
		return {
			profession
		};
	}
	return {};
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
	return {
		updateProfession: bindActionCreators<Action<any>, any>(updateProfession, dispatch)
	};
};

export default connect<
	IProfessionTableMapStateToProps,
	IProfessionTableMapDispatchToProps,
	IProfessionTableProps,
	IRootState
>(
	mapStateToProps,
	mapDispatchToProps
)(ProfessionTable);
