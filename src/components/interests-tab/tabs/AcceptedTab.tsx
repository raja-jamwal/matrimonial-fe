import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Interest } from '../../../store/reducers/account-defination';
import { toArray, sortBy } from 'lodash';
import { IRootState } from '../../../store/index';
import { bindActionCreators, Dispatch } from 'redux';
import {
	fetchAcceptedInterests,
	setAcceptedInterestRefreshing
} from '../../../store/reducers/interest-reducer';
import { connect } from 'react-redux';
import VirtualProfileList from '../../virtual-profile-list/index';
import { Value } from '../../text';
import { isAccountPaid } from '../../../store/reducers/account-reducer';

interface IAcceptedTabMapStateToProps {
	acceptedInterests: Array<Interest>;
	fetching: boolean;
	totalAcceptedInterests: number;
	isAccountPaid: boolean;
}

interface IAcceptedTabDispatchToProps {
	fetchAcceptedInterests: () => any;
	setAcceptedInterestRefreshing: () => any;
}

class AcceptedTab extends React.Component<
	IAcceptedTabMapStateToProps & IAcceptedTabDispatchToProps
> {
	constructor(props: any) {
		super(props);
		this._handleMore = this._handleMore.bind(this);
	}

	componentWillMount() {
		const { fetchAcceptedInterests } = this.props;
		console.log('fetching accepted interests');
		fetchAcceptedInterests();
	}

	getAcceptedInterests(): Array<Interest> {
		const { acceptedInterests } = this.props;
		return sortBy(toArray(acceptedInterests), 'createdOn').reverse();
	}

	profileIdExtractor(interest: Interest) {
		return interest.toUser.id;
	}
	profileNameExtractor(interest: Interest) {
		return interest.toUser.fullName;
	}

	totalCount() {
		const { fetching, totalAcceptedInterests } = this.props;
		if (fetching) return null;
		return (
			<View style={styles.totalCountContainer}>
				<Value>{totalAcceptedInterests} Accepted Interests</Value>
			</View>
		);
	}

	async _handleMore() {
		const { fetchAcceptedInterests } = this.props;
		await fetchAcceptedInterests();
	}

	async handleRefreshing() {
		const { setAcceptedInterestRefreshing } = this.props;
		await setAcceptedInterestRefreshing();
		await this._handleMore();
	}

	render() {
		const { fetching, isAccountPaid } = this.props;
		return (
			<VirtualProfileList
				fetching={fetching}
				data={this.getAcceptedInterests()}
				profileIdExtractor={this.profileIdExtractor}
				profileNameExtractor={this.profileNameExtractor}
				// headerComponent={this.totalCount()}
				handleMore={this._handleMore}
				handleRefresh={() => this.handleRefreshing()}
				isAccountPaid={isAccountPaid}
			/>
		);
	}
}

const styles = StyleSheet.create({
	totalCountContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		margin: 15
	}
});

const mapStateToProps = (state: IRootState) => {
	const acceptedInterests = state.interests.accepted.profiles;
	const fetching = state.interests.accepted.fetching;
	const totalAcceptedInterests = state.interests.accepted.pageable.totalElements;

	return {
		acceptedInterests,
		fetching,
		totalAcceptedInterests,
		isAccountPaid: isAccountPaid(state)
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		fetchAcceptedInterests: bindActionCreators(fetchAcceptedInterests, dispatch),
		setAcceptedInterestRefreshing: bindActionCreators(setAcceptedInterestRefreshing, dispatch)
	};
};

const connectedAcceptedTab = connect(
	mapStateToProps,
	mapDispatchToProps
)(AcceptedTab);

export default connectedAcceptedTab;
