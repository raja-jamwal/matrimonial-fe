import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Interest } from '../../../store/reducers/account-defination';
import { toArray, sortBy } from 'lodash';
import { IRootState } from '../../../store/index';
import { bindActionCreators, Dispatch } from 'redux';
import { fetchAcceptedInterests } from '../../../store/reducers/interest-reducer';
import { connect } from 'react-redux';
import VirtualProfileList from '../../virtual-profile-list/index';

interface IAcceptedTabMapStateToProps {
	acceptedInterests: Array<Interest>;
	fetching: boolean;
	totalAcceptedInterests: number;
}

interface IAcceptedTabDispatchToProps {
	fetchAcceptedInterests: () => any;
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
		return sortBy(toArray(acceptedInterests), 'updatedOn');
	}

	profileIdExtractor(interest: Interest) {
		return interest.toUser.id;
	}

	totalCount() {
		const { fetching, totalAcceptedInterests } = this.props;
		if (fetching) return null;
		return (
			<View style={styles.totalCountContainer}>
				<Text>{totalAcceptedInterests} Accepted Interests</Text>
			</View>
		);
	}

	_handleMore() {
		const { fetchAcceptedInterests } = this.props;
		fetchAcceptedInterests();
	}

	render() {
		const { fetching } = this.props;
		return (
			<VirtualProfileList
				fetching={fetching}
				data={this.getAcceptedInterests()}
				profileIdExtractor={this.profileIdExtractor}
				headerComponent={this.totalCount()}
				handleMore={this._handleMore}
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
		totalAcceptedInterests
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		fetchAcceptedInterests: bindActionCreators(fetchAcceptedInterests, dispatch)
	};
};

const connectedAcceptedTab = connect(
	mapStateToProps,
	mapDispatchToProps
)(AcceptedTab);

export default connectedAcceptedTab;