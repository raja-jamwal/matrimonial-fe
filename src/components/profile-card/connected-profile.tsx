import ProfileCard, { IProfileProps } from './index';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import { IRootState } from '../../store/index';
import { getLogger } from '../../utils/logger';
import { getCurrentUserProfileId, isAccountPaid } from '../../store/reducers/account-reducer';
import { bindActionCreators, Dispatch } from 'redux';
import { setUserProfileFavourite } from '../../store/reducers/favourite-reducer';
import { getUserProfileForId } from '../../store/reducers/user-profile-reducer';
import {
	markProfileAsBlocked,
	isProfileBlocked,
	isProfileDeleted,
	fetchHoroscopeCompatibility
} from '../../store/reducers/user-profile-reducer';

const logger = getLogger('ConnectedProfile');

const mapStateToProps = (state: IRootState, ownProps: IProfileProps) => {
	const accountData = state.account;

	if (isEmpty(accountData)) {
		logger.log('dev: empty user account, we probably deleted the account in server restart');
		logger.log('dev: create a new account');
		return {};
	}

	const userProfile =
		(ownProps.userProfileId &&
			state.userProfiles &&
			state.userProfiles[ownProps.userProfileId]) ||
		null;

	if (!userProfile) return {};

	const currentProfileId = getCurrentUserProfileId(state);

	const isSelfProfile = !isEmpty(userProfile) && userProfile.id === currentProfileId;
	return {
		userProfile,
		isSelfProfile,
		isAccountPaid: isAccountPaid(state),
		isProfileBlocked: isProfileBlocked(state, userProfile.id),
		isProfileDeleted: isProfileDeleted(state, userProfile.id),
		currentUserProfile: currentProfileId && getUserProfileForId(state, currentProfileId)
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		setUserProfileFavourite: bindActionCreators(setUserProfileFavourite, dispatch),
		markProfileAsBlocked: bindActionCreators(markProfileAsBlocked, dispatch),
		fetchHoroscopeCompatibility: bindActionCreators(fetchHoroscopeCompatibility, dispatch)
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ProfileCard);
