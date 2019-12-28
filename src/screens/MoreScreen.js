import React from 'react';
import { View, StyleSheet, AsyncStorage } from 'react-native';
import Text from '../components/text/index';
import Colors from '../constants/Colors';
import ConnectedPaymentModal from '../components/payment-modal/payment-modal';
import Button from '../components/button/button';
import ConnectedProfile from '../components/profile-card/connected-profile';
import { getAccount, getCurrentUserProfileId } from '../store/reducers/account-reducer';
import { getUserProfileForId } from '../store/reducers/user-profile-reducer';
import { connect } from 'react-redux';
import moment from 'moment';
import { Value } from '../components/text';
import { Updates } from 'expo';

class MoreScreen extends React.Component {
	static navigationOptions = {
		title: 'More'
	};

	state = {
		showPayment: false
	};

	toggleStartPayment() {
		this.setState(prevState => ({
			showPayment: !prevState.showPayment
		}));
	}

	openProfileScreen(userProfileId, profileName) {
		const { navigation } = this.props;
		navigation.push('ProfileScreen', { userProfileId, profileName });
	}

	// given a ts (unix epoch in seconds)
	getDate(epoch) {
		return new Date(epoch * 1000);
	}

	getCurrentTsInSecond() {
		return Math.floor(new Date().getTime() / 1000);
	}

	renderPlanInformation() {
		const { account } = this.props;
		const payment = account.payment;
		const isPaid = payment.selectedPackage === 'paid';
		const isExpired = this.getCurrentTsInSecond() > payment.expiryDate;
		return (
			<View
				style={{
					flexDirection: 'column',
					justifyContents: 'center',
					alignItems: 'center',
					paddingTop: 20
				}}
			>
				<Value>{isPaid ? 'Paid' : 'Free'} Plan</Value>
				{isPaid && (
					<View>
						<Value>
							Expires on:
							{moment(this.getDate(payment.expiryDate || 0)).format(
								'dddd, MMMM Do YYYY'
							)}
						</Value>
						<Value>Receipt Number: {payment.receiptNumber}</Value>
					</View>
				)}
				{(!isPaid || isExpired) && (
					<Button label="Purchase plan" onPress={() => this.toggleStartPayment()} />
				)}
				<View style={{ paddingTop: 10 }}>
					<Button label="Logout" onPress={() => this.doLogout()} />
				</View>
			</View>
		);
	}

	async doLogout() {
		await AsyncStorage.removeItem('accountId');
		await Updates.reloadFromCache();
	}

	render() {
		const { showPayment } = this.state;
		const { currentUserProfile, account } = this.props;
		return (
			<View style={styles.container}>
				<Text style={[styles.title]}>Rishto v0.1</Text>
				<Text style={styles.offWhite}>Sindhyun jo Sindhyun sa</Text>
				<Text style={styles.offWhite}>For support & help contact</Text>
				<Text style={styles.offWhite}>feedback@domain.com</Text>

				{this.renderPlanInformation()}

				<ConnectedPaymentModal
					show={showPayment}
					requestClose={() => this.toggleStartPayment()}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	title: {
		fontSize: 20
	},
	offWhite: {
		color: Colors.offWhite
	}
});

const mapStateToProps = state => {
	const currentUserProfileId = getCurrentUserProfileId(state);
	return {
		account: getAccount(state),
		currentUserProfile: getUserProfileForId(state, currentUserProfileId)
	};
};

export default connect(
	mapStateToProps,
	null
)(MoreScreen);
