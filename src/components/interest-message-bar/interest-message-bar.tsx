import * as React from 'react';
import { View, Text, TouchableNativeFeedback, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { IRootState } from '../../store';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { getCurrentUserProfileId } from '../../store/reducers/account-reducer';
import { API } from '../../config/API';
import { ApiRequest, formatDuration } from '../../utils';
import { getLogger } from '../../utils/logger';
import { Channel, Interest } from '../../store/reducers/account-defination';
import { Throbber } from '../throbber/throbber';
import { addChannel } from '../../store/reducers/channel-reducer';
import { NavigationInjectedProps, withNavigation } from 'react-navigation';
import { addSentInterest } from '../../store/reducers/interest-reducer';
import { Value } from '../text';
import ConnectedPurchaseButton from '../purchase-button/purchase-button';

interface IMapStateToProps {
	currentUserProfileId?: number;
}

interface IMapDispatchToProps {
	addChannel: (channel: Channel) => any;
	addSentInterest: (interest: Interest) => any;
}

interface PassedInProps {
	userProfileId: number;
}

type IInterestMessageBarProps = NavigationInjectedProps &
	IMapStateToProps &
	IMapDispatchToProps &
	PassedInProps;

enum InterestStates {
	NONE,
	SHOW_INTEREST,
	SENT_PENDING,
	SENT_ACCEPTED,
	SENT_DECLINED,
	RECV_PENDING,
	RECV_ACCEPTED,
	RECV_DECLINED
}

interface IState {
	fetchingInterest: boolean;
	fetchingChannel: boolean;
	interestState: InterestStates;
	sentInterest: Interest | null;
	incomingInterest: Interest | null;
}

class InterestMessageBar extends React.Component<IInterestMessageBarProps, IState> {
	logger = getLogger(InterestMessageBar);

	constructor(props: IInterestMessageBarProps) {
		super(props);
		this.state = {
			fetchingInterest: false,
			fetchingChannel: false,
			interestState: InterestStates.NONE,
			sentInterest: null,
			incomingInterest: null
		};
	}

	async updateInterestState() {
		const { currentUserProfileId, userProfileId } = this.props;
		this.setState({
			fetchingInterest: true
		});
		let sentInterest: Interest | null = null;
		try {
			sentInterest = await ApiRequest(API.INTEREST.GET, {
				fromUserId: currentUserProfileId,
				toUserId: userProfileId
			});
		} catch (e) {
			this.logger.log('No sent interest');
		}

		if (sentInterest) {
			this.logger.log('User sent interest');
		}

		let incomingInterest: Interest | null = null;

		try {
			incomingInterest = await ApiRequest(API.INTEREST.GET, {
				fromUserId: userProfileId,
				toUserId: currentUserProfileId
			});
		} catch (e) {
			this.logger.log('No received interest');
		}

		if (incomingInterest) {
			this.logger.log('User received interest');
		}

		let interestState = InterestStates.SHOW_INTEREST;

		if (!sentInterest && !incomingInterest) {
			interestState = InterestStates.SHOW_INTEREST;
		}

		if (sentInterest) {
			switch (sentInterest.status) {
				case 'pending':
					interestState = InterestStates.SENT_PENDING;
					break;
				case 'accepted':
					interestState = InterestStates.SENT_ACCEPTED;
					break;
				case 'declined':
					interestState = InterestStates.SENT_DECLINED;
					break;
				default:
					interestState = InterestStates.SHOW_INTEREST;
			}
		}

		// if sent request is declined or accepted, do early short-circuit

		if (
			interestState === InterestStates.SENT_DECLINED ||
			interestState === InterestStates.SENT_ACCEPTED
		) {
			return this.setState({
				fetchingInterest: false,
				interestState,
				sentInterest,
				incomingInterest
			});
		}

		if (incomingInterest) {
			switch (incomingInterest.status) {
				case 'pending':
					interestState = InterestStates.RECV_PENDING;
					break;
				case 'accepted':
					interestState = InterestStates.RECV_ACCEPTED;
					break;
				case 'declined':
					interestState = InterestStates.RECV_DECLINED;
					break;
				default:
					interestState = InterestStates.SHOW_INTEREST;
			}
		}

		this.setState({
			fetchingInterest: false,
			interestState,
			sentInterest,
			incomingInterest
		});
	}

	async componentWillMount() {
		await this.updateInterestState();
	}

	async showInterest() {
		const { currentUserProfileId, userProfileId, addSentInterest } = this.props;
		try {
			const interest = await ApiRequest(API.INTEREST.SAVE, {
				fromUserId: currentUserProfileId,
				toUserId: userProfileId
			});
			addSentInterest(interest);
		} catch (er) {
			this.logger.log('error saving interest ', er);
		}
		await this.updateInterestState();
	}

	async saveInterest(accept: boolean = false) {
		// and update interest state
		const { incomingInterest } = this.state;
		if (!incomingInterest) return;
		const status = accept ? 'accepted' : 'declined';
		try {
			await ApiRequest(API.INTEREST.SAVE, {
				fromUserId: incomingInterest.fromUser.id,
				toUserId: incomingInterest.toUser.id,
				status
			});
		} catch (er) {
			this.logger.log('saved interest to ', status);
		}
		await this.updateInterestState();
	}

	renderInterestStatus() {
		const { interestState, sentInterest, incomingInterest } = this.state;
		return (() => {
			switch (interestState) {
				case InterestStates.SENT_PENDING:
					return (
						<Value style={styles.statusText}>
							You sent a interest at{' '}
							{sentInterest && formatDuration(sentInterest.updatedOn)}
						</Value>
					);
				case InterestStates.SENT_ACCEPTED:
					return (
						<Value style={styles.statusText}>
							Your interest was accepted at{' '}
							{sentInterest && formatDuration(sentInterest.updatedOn)}
						</Value>
					);
				case InterestStates.SENT_DECLINED:
					return (
						<Value style={styles.statusText}>
							Your interest was declined at{' '}
							{sentInterest && formatDuration(sentInterest.updatedOn)}
						</Value>
					);
				case InterestStates.RECV_PENDING:
					return (
						<Value style={styles.statusText}>
							Your received interest at{' '}
							{incomingInterest && formatDuration(incomingInterest.updatedOn)}
						</Value>
					);
				case InterestStates.RECV_ACCEPTED:
					return (
						<Value style={styles.statusText}>
							You accepted interest at{' '}
							{incomingInterest && formatDuration(incomingInterest.updatedOn)}
						</Value>
					);
				case InterestStates.RECV_DECLINED:
					return (
						<Value style={styles.statusText}>
							You declined interest at{' '}
							{incomingInterest && formatDuration(incomingInterest.updatedOn)}
						</Value>
					);
				default:
					return null;
			}
		})();
	}

	async startMessaging() {
		const { currentUserProfileId, userProfileId, addChannel, navigation } = this.props;

		this.setState({
			fetchingChannel: true
		});

		let channel: Channel | null = null;

		// fetch channel from API
		try {
			channel = await ApiRequest(API.CHANNEL.GET, {
				fromUserId: currentUserProfileId,
				toUserId: userProfileId
			});
		} catch (er) {
			this.logger.log('No channel exists for these 2 users');
		}

		if (!channel) {
			try {
				channel = await ApiRequest(API.CHANNEL.SAVE, {
					fromUserId: currentUserProfileId,
					toUserId: userProfileId
				});
			} catch (er) {
				this.logger.log('Unable to create channel for the users');
			}
		}

		this.setState({
			fetchingChannel: false
		});

		// update channel in store
		if (channel) {
			addChannel(channel);
			navigation.push('ChatScreen', { channelId: channel.channelIdentity.id });
		}
	}

	renderActions() {
		const { interestState, fetchingInterest } = this.state;
		if (fetchingInterest) return null;
		return (
			<View style={styles.row}>
				{interestState === InterestStates.SHOW_INTEREST && (
					<ConnectedPurchaseButton label="Purchase plan to send Interest">
						<TouchableNativeFeedback onPress={() => this.showInterest()}>
							<View style={styles.column}>
								<View style={styles.btnContainer}>
									<Ionicons name="md-flash" size={20} color="white" />
									<Text style={styles.text}>Show Interest</Text>
								</View>
							</View>
						</TouchableNativeFeedback>
					</ConnectedPurchaseButton>
				)}
				{interestState !== InterestStates.SHOW_INTEREST && (
					<View style={styles.statusContainer}>{this.renderInterestStatus()}</View>
				)}
				{interestState === InterestStates.RECV_PENDING && (
					<View style={styles.row}>
						<View style={styles.column}>
							<TouchableNativeFeedback onPress={() => this.saveInterest(true)}>
								<View style={styles.interestAction}>
									<Text style={styles.text}>Accept</Text>
								</View>
							</TouchableNativeFeedback>
						</View>
						<View style={styles.column}>
							<TouchableNativeFeedback onPress={() => this.saveInterest(false)}>
								<View style={styles.interestAction}>
									<Text style={styles.text}>Decline</Text>
								</View>
							</TouchableNativeFeedback>
						</View>
					</View>
				)}
				{(interestState === InterestStates.SENT_ACCEPTED ||
					interestState === InterestStates.RECV_ACCEPTED) && (
					<TouchableNativeFeedback onPress={() => this.startMessaging()}>
						<View style={styles.column}>
							<View style={styles.btnContainer}>
								<Ionicons name="md-chatboxes" size={20} color="white" />
								<Text style={styles.text}>Message</Text>
							</View>
						</View>
					</TouchableNativeFeedback>
				)}
			</View>
		);
	}

	render() {
		const { fetchingInterest } = this.state;
		return (
			<View style={styles.container}>
				<View style={styles.barContainer}>
					{!!fetchingInterest && (
						<View style={styles.statusContainer}>
							<Throbber size="small" />
						</View>
					)}
					{this.renderActions()}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		borderTopWidth: 0,
		elevation: 10,
		backgroundColor: 'white'
	},
	barContainer: {
		flexDirection: 'row'
	},
	statusContainer: {
		flex: 1,
		flexDirection: 'row',
		margin: 8,
		padding: 5,
		paddingLeft: 15
	},
	btnContainer: {
		flexDirection: 'row',
		backgroundColor: Colors.primaryDarkColor,
		margin: 8,
		padding: 5,
		paddingLeft: 15,
		borderRadius: 10,
		justifyContent: 'center'
	},
	column: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center'
	},
	row: {
		flex: 1,
		flexDirection: 'row'
	},
	text: {
		color: 'white',
		paddingLeft: 20
	},
	statusText: {
		textAlign: 'center',
		color: Colors.black,
		fontWeight: '500'
	},
	interestAction: {
		backgroundColor: Colors.primaryDarkColor,
		paddingTop: 5,
		paddingBottom: 5,
		marginRight: 5,
		borderRadius: 10
	}
});

const mapStateToProps = (state: IRootState) => {
	return {
		currentUserProfileId: getCurrentUserProfileId(state)
	};
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
	return {
		addChannel: bindActionCreators(addChannel, dispatch),
		addSentInterest: bindActionCreators(addSentInterest, dispatch)
	};
};

const ConnectedInterestMessageBar = connect(
	mapStateToProps,
	mapDispatchToProps
)(InterestMessageBar);

export default withNavigation(ConnectedInterestMessageBar);
