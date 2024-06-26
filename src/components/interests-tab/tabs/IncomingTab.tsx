import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IRootState } from '../../../store/index';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import {
	fetchIncomingInterests,
	setIncomingInterestRefreshing
} from '../../../store/reducers/interest-reducer';
import { Interest } from '../../../store/reducers/account-defination';
import VirtualProfileList from '../../virtual-profile-list/index';
import { toArray, sortBy } from 'lodash';
import { Value } from '../../text';
import { isAccountPaid } from '../../../store/reducers/account-reducer';

interface IIncomingTabMapStateToProps {
	incomingInterests: Array<Interest>;
	fetching: boolean;
	totalIncomingInterests: number;
	isAccountPaid: boolean;
}

interface IIncomingTabMapDispatchToProps {
	fetchIncomingInterests: () => any;
	setIncomingInterestRefreshing: () => any;
}

class IncomingTab extends React.PureComponent<
	IIncomingTabMapStateToProps & IIncomingTabMapDispatchToProps
> {
	constructor(props: any) {
		super(props);
		this._handleMore = this._handleMore.bind(this);
	}

	componentWillMount() {
		const { fetchIncomingInterests } = this.props;
		fetchIncomingInterests();
	}

	getIncomingInterests(): Array<Interest> {
		const { incomingInterests } = this.props;
		return sortBy(toArray(incomingInterests), 'createdOn').reverse();
	}

	profileIdExtractor(interest: Interest) {
		return interest.fromUser.id;
	}
	profileNameExtractor(interest: Interest) {
		return interest.fromUser.fullName;
	}
	totalCount() {
		const { fetching, totalIncomingInterests } = this.props;
		if (fetching) return null;
		return (
			<View style={styles.totalCountContainer}>
				<Value>{totalIncomingInterests} Incoming Interests</Value>
			</View>
		);
	}

	async _handleMore() {
		const { fetchIncomingInterests } = this.props;
		fetchIncomingInterests();
	}

	async handleRefreshing() {
		const { setIncomingInterestRefreshing } = this.props;
		await setIncomingInterestRefreshing();
		await this._handleMore();
	}

	render() {
		const { fetching, isAccountPaid } = this.props;
		return (
			<VirtualProfileList
				fetching={fetching}
				data={this.getIncomingInterests()}
				profileIdExtractor={this.profileIdExtractor}
				profileNameExtractor={this.profileNameExtractor}
				// headerComponent={this.totalCount()} // TODO: how to handle total count when profiles are blocked
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
	const incomingInterests = state.interests.incoming.profiles;
	const fetching = state.interests.incoming.fetching;
	const totalIncomingInterests = state.interests.incoming.pageable.totalElements;

	return {
		incomingInterests,
		fetching,
		totalIncomingInterests,
		isAccountPaid: isAccountPaid(state)
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		fetchIncomingInterests: bindActionCreators(fetchIncomingInterests, dispatch),
		setIncomingInterestRefreshing: bindActionCreators(setIncomingInterestRefreshing, dispatch)
	};
};

const connectedIncomingTab = connect(
	mapStateToProps,
	mapDispatchToProps
)(IncomingTab);

export default connectedIncomingTab;
