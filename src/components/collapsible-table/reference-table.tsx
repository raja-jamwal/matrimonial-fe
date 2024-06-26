import * as React from 'react';
import CollapsibleTable from './index';
import { IRootState } from '../../store/index';
import { connect } from 'react-redux';
import { UserReference } from '../../store/reducers/account-defination';
import { AnyAction, bindActionCreators, Dispatch } from 'redux';
import { updateUserReference } from '../../store/reducers/user-profile-reducer';
import { Action } from 'redux-actions';

interface IReferenceTableProps {
	userProfileId: number;
	editable: boolean;
}
interface IReferenceTableMapStateToProps {
	userReference?: UserReference;
}
interface IReferenceTableMapDispatchToProps {
	updateUserReference: () => any;
}

class ReferenceTable extends React.Component<
	IReferenceTableProps & IReferenceTableMapDispatchToProps & IReferenceTableMapStateToProps
> {
	mappings = {
		relativeName: {
			label: 'Relative Name',
			type: 'string'
		},
		relationWithMember: {
			label: 'Relation with the member',
			type: 'string'
		},
		contactNumber: {
			label: 'Contact Number',
			type: 'number'
		},
		address: {
			label: 'Address',
			type: 'string'
		}
	};

	render() {
		const { userReference, userProfileId, updateUserReference, editable } = this.props;
		if (!userReference) return null;
		return (
			<CollapsibleTable
				title="References"
				object={userReference}
				mapping={this.mappings}
				updateAction={updateUserReference}
				userProfileId={userProfileId}
				editable={editable}
			/>
		);
	}
}

const mapStateToProps = (initialState: IRootState, ownProps: IReferenceTableProps) => {
	const profileId = ownProps.userProfileId;
	const profile = initialState.userProfiles[profileId];
	if (profile) {
		const userReference = profile.userReference;
		return {
			userReference
		};
	}
	return {};
};

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
	return {
		updateUserReference: bindActionCreators<Action<any>, any>(updateUserReference, dispatch)
	};
};

export default connect<
	IReferenceTableMapStateToProps,
	IReferenceTableMapDispatchToProps,
	IReferenceTableProps,
	IRootState
>(
	mapStateToProps,
	mapDispatchToProps
)(ReferenceTable);
