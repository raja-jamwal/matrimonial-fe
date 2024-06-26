import {
	ContactInformation,
	DAO,
	Education,
	Family,
	FamilyOtherInformation,
	Horoscope,
	Investments,
	Lifestyle,
	PhotosEntity,
	Preference,
	Profession,
	UserProfile,
	UserReference,
	Verification
} from './account-defination';
import { createAction, handleActions } from 'redux-actions';
import { IRootState } from '../index';
import { API } from '../../config/API';
import { Dispatch } from 'redux';
import { ApiRequest } from '../../utils/index';
import {
	addSelfProfile,
	getCurrentUserProfile,
	getSelfProfileId,
	setSelfProfileUpdating,
	getCurrentUserProfileId
} from './self-profile-reducer';
import { createSelector } from 'reselect';
import { getLogger } from '../../utils/logger';
import { isEmpty } from 'lodash';
import { isAccountPaid } from './account-reducer';
import { simpleAlert } from '../../components/alert/index';
export interface IUserProfileState {
	[id: number]: UserProfile;
}

// selector

export const getUserProfiles = (state: IRootState) => state.userProfiles;
export const getUserProfileFromState = (state: IRootState, userProfileId: number) =>
	state.userProfiles[userProfileId];
export const getUserProfileForId = createSelector(
	getUserProfileFromState,
	profile => profile || null
);
export const isProfileBlocked = (state: IRootState, userProfileId: number) => {
	const userProfile = state.userProfiles[userProfileId];
	if (!userProfile) return true;
	return userProfile.isBlocked;
};

export const isProfileDeleted = createSelector(
	getUserProfileFromState,
	profile => !!profile.deletedOn
);

const defaultProfileState: IUserProfileState = {};

const ADD_PROFILE = 'ADD_PROFILE';
const BULK_ADD_PROFILE = 'BULK_ADD_PROFILE';
const BLOCK_PROFILE = 'BLOCK_PROFILE';
const UNBLOCK_PROFILE = 'UNBLOCK_PROFILE';
export const addProfile = createAction<UserProfile>(ADD_PROFILE);
export const bulkAddProfile = createAction<Array<UserProfile>>(BULK_ADD_PROFILE);

export const unblockProfile = createAction<UserProfile>(UNBLOCK_PROFILE);
export const markProfileAsUnBlocked = function(userProfile: UserProfile) {
	const logger = getLogger(markProfileAsUnBlocked);
	return (dispatch: Dispatch<any>, getState: () => IRootState) => {
		logger.log(`marking profile Id ${userProfile.id} as unblocked`);
		const currentUserProfileId = getCurrentUserProfileId(getState());
		dispatch(unblockProfile(userProfile));
		return ApiRequest(API.BLOCK.UNBLOCK, {
			byUserProfileId: currentUserProfileId,
			blockedUserProfileId: userProfile.id
		}).catch(err => logger.log('unable to mark profile as unblocked', err));
	};
};

export const blockProfile = createAction<UserProfile>(BLOCK_PROFILE);
export const markProfileAsBlocked = function(userProfile: UserProfile, shouldReport: boolean) {
	const logger = getLogger(markProfileAsBlocked);
	return (dispatch: Dispatch<any>, getState: () => IRootState) => {
		const currentProfileId = getCurrentUserProfileId(getState());
		if (!userProfile) return;
		if (userProfile.id === currentProfileId) return;
		logger.log(`marking profile Id ${userProfile.id} as blocked`);
		dispatch(blockProfile(userProfile));
		return ApiRequest(API.BLOCK.REPORT, {
			byUserProfileId: currentProfileId,
			blockedUserProfileId: userProfile.id,
			shouldReport
		}).catch(err => logger.log('unable to mark profile as blocked', err));
	};
};

interface IUpdateEnityPayload {
	userProfileId: number;
	object: any;
}

export const markProfileAsViewed = function(userProfileId: number) {
	const logger = getLogger(markProfileAsViewed);
	return (_dispatch: Dispatch<any>, getState: () => IRootState) => {
		const currentProfileId = getCurrentUserProfileId(getState());
		if (userProfileId === currentProfileId) return;
		logger.log(`marking profile Id ${userProfileId} as viewed`);
		return ApiRequest(API.VIEWED_MY_PROFILE.SAVE, {
			actorUserProfileId: currentProfileId,
			userProfileId
		}).catch(err => logger.log('unable to mark profile as viewed', err));
	};
};

export const getViewedMyContact = function(userProfileId: number) {
	const logger = getLogger(getViewedMyContact);
	return (_dispatch: Dispatch<any>, getState: () => IRootState) => {
		logger.log(`fetching viewed contact of profileId ${userProfileId}`);
		return new Promise((resolve, _reject) => {
			ApiRequest(API.VIEWED_MY_CONTACT.GET, {
				actorUserProfileId: userProfileId,
				userProfileId: getCurrentUserProfileId(getState())
			})
				.then(_res => resolve(true))
				.catch(err => {
					logger.log(`error fetching viewed contact ${userProfileId}`, err);
					resolve(false);
				});
		});
	};
};

export const saveViewedMyContact = function(userProfileId: number) {
	const logger = getLogger(saveViewedMyContact);
	return (_dispatch: Dispatch<any>, getState: () => IRootState) => {
		logger.log(`mark viewed contact for userProfileId ${userProfileId}`);
		return ApiRequest(API.VIEWED_MY_CONTACT.SAVE, {
			actorUserProfileId: getCurrentUserProfileId(getState()),
			userProfileId
		}).catch(err => logger.log(`unable to mark viewed contact ${userProfileId}`, err));
	};
};

export const updatePhoto = function(photos: PhotosEntity[]) {
	const logger = getLogger(updatePhoto);
	return (dispatch: Dispatch<any>, getState: () => IRootState) => {
		logger.log('trying to update photos');
		const currentProfileId = getCurrentUserProfileId(getState());
		if (!currentProfileId) return;
		const currentUserProfile = getUserProfileForId(getState(), currentProfileId);
		if (!currentUserProfile) return;
		const updatedProfile = {
			...currentUserProfile,
			photo: ([] as Array<PhotosEntity>).concat(photos)
		};
		dispatch(updateUserProfile({ userProfileId: updatedProfile.id, object: updatedProfile }));
		dispatch(addSelfProfile(updatedProfile));
		logger.log('photos updated');
	};
};

export const uploadPhoto = function(file: any) {
	const logger = getLogger(uploadPhoto);
	console.log('uri ', file.uri);
	return (dispatch: Dispatch<any>, getState: () => IRootState) => {
		const state = getState();
		const currentUserProfile = getCurrentUserProfile(state);
		if (!currentUserProfile) return;
		logger.log('starting to upload');
		dispatch(setSelfProfileUpdating(true));
		return ApiRequest(API.PHOTO.UPLOAD, {
			file
		})
			.then(async (response: any) => {
				logger.log('uploaded image', response.url);
				const photo = { url: response.url, isApproved: false } as PhotosEntity;
				const updatedProfile: UserProfile = {
					...currentUserProfile,
					photo: currentUserProfile.photo.concat(photo)
				};
				/**
				 * Update server, local userProfiles store
				 * & selfProfile store
				 */
				const updatedProfileFromServer = (await dispatch(
					updateUserProfile({ userProfileId: updatedProfile.id, object: updatedProfile })
				)) as any;
				dispatch(addSelfProfile(updatedProfileFromServer as UserProfile));
				dispatch(setSelfProfileUpdating(false));
			})
			.catch(err => {
				logger.log('err ', err);
				dispatch(setSelfProfileUpdating(false));
				throw err;
			});
	};
};

const patchEntity = (entityUrl: string, object: any, entityId?: number, token?: string) => {
	const url = entityId ? `${entityUrl}/${entityId}` : entityUrl;
	const method = entityId ? 'PATCH' : 'POST';
	return fetch(url, {
		method: method,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: token || ''
		},
		body: JSON.stringify(object)
	})
		.then(response => {
			if (response.status !== 200) {
				throw response.json();
			}
			return response;
		})
		.then(response => response.json())
		.catch(err => console.log('err ', err));
};

const updateLocalAndServer = function<T extends DAO>(
	userProfileId: number,
	entity: T,
	entityUrl: string,
	getUpdatedProfile: (userProfile: UserProfile, entity: T) => UserProfile,
	direct?: boolean
) {
	const logger = getLogger(updateLocalAndServer);
	return (dispatch: Dispatch<any>, getState: () => IRootState) => {
		if (!userProfileId) return null;
		// not using rule in account-reducer
		// because of cyclic dependancy
		const account = getState().account;
		if (isEmpty(account) || isEmpty(account.token)) {
			return logger.log('need account & token to update profile');
		}
		const entityId = direct ? undefined : entity.id;
		logger.log(`entityId ${entityId} ${entityUrl}`);
		return patchEntity(entityUrl, entity, entityId, account.token)
			.then((updatedServerEntity: T) => {
				const userProfile = getState().userProfiles[userProfileId];
				const clonedProfile = { ...userProfile };
				const updatedUserProfile = getUpdatedProfile(clonedProfile, updatedServerEntity);
				dispatch(addProfile({ ...updatedUserProfile }));
				return updatedUserProfile;
			})
			.catch(err => logger.log('err ', err));
	};
};

export const updateVerification = function({ userProfileId, object }: IUpdateEnityPayload) {
	const updateFunc = (userProfile: UserProfile, verification: Verification) => {
		userProfile.verification = verification;
		return userProfile;
	};
	return updateLocalAndServer<Verification>(
		userProfileId,
		object,
		API.VERIFICATION.SAVE,
		updateFunc,
		true
	);
};

export const updateUserProfile = function({ userProfileId, object }: IUpdateEnityPayload) {
	const updateFunc = (_userProfile: UserProfile, newUserProfile: UserProfile) => newUserProfile;
	return updateLocalAndServer<UserProfile>(
		userProfileId,
		object,
		API.USER_PROFILE.SAVE,
		updateFunc,
		true
	);
};

export const updateEducation = function({ userProfileId, object }: IUpdateEnityPayload) {
	const updateFunc = (userProfile: UserProfile, education: Education) => {
		userProfile.education = education;
		return userProfile;
	};
	return updateLocalAndServer<Education>(
		userProfileId,
		object,
		API.EDUCATION.SAVE,
		updateFunc,
		true
	);
};

export const updateProfession = function({ userProfileId, object }: IUpdateEnityPayload) {
	const updateFunc = (userProfile: UserProfile, profession: Profession) => {
		userProfile.profession = profession;
		return userProfile;
	};
	return updateLocalAndServer<Profession>(
		userProfileId,
		object,
		API.PROFESSION.SAVE,
		updateFunc,
		true
	);
};

export const updateHoroscope = function({ userProfileId, object }: IUpdateEnityPayload) {
	const updateFunc = (userProfile: UserProfile, horoscope: Horoscope) => {
		userProfile.horoscope = horoscope;
		return userProfile;
	};
	return updateLocalAndServer<Horoscope>(
		userProfileId,
		object,
		API.HOROSCOPE.SAVE,
		updateFunc,
		true
	);
};

export const updateInvestment = function({ userProfileId, object }: IUpdateEnityPayload) {
	const updateFunc = (userProfile: UserProfile, investments: Investments) => {
		userProfile.investments = investments;
		return userProfile;
	};
	return updateLocalAndServer<Investments>(
		userProfileId,
		object,
		API.INVESTMENT.SAVE,
		updateFunc,
		true
	);
};

export const updateLifestyle = function({ userProfileId, object }: IUpdateEnityPayload) {
	const updateFunc = (userProfile: UserProfile, lifestyle: Lifestyle) => {
		userProfile.lifestyle = lifestyle;
		return userProfile;
	};
	return updateLocalAndServer<Lifestyle>(
		userProfileId,
		object,
		API.LIFESTYLE.SAVE,
		updateFunc,
		true
	);
};

export const updateContactInformation = function({ userProfileId, object }: IUpdateEnityPayload) {
	const updateFunc = (userProfile: UserProfile, contactInformation: ContactInformation) => {
		// console.log('contactInfo ', contactInformation);
		userProfile.contactInformation = contactInformation;
		return userProfile;
	};
	return updateLocalAndServer<ContactInformation>(
		userProfileId,
		object,
		API.CONTACT_INFORMATION.SAVE,
		updateFunc,
		true
	);
};

export const updateUserReference = function({ userProfileId, object }: IUpdateEnityPayload) {
	const updateFunc = (userProfile: UserProfile, userReference: UserReference) => {
		userProfile.userReference = userReference;
		return userProfile;
	};
	return updateLocalAndServer<UserReference>(
		userProfileId,
		object,
		API.USER_REFERENCE.SAVE,
		updateFunc,
		true
	);
};

export const updateFamily = function({ userProfileId, object }: IUpdateEnityPayload) {
	const updateFunc = (userProfile: UserProfile, family: Family) => {
		userProfile.family = family;
		return userProfile;
	};
	return updateLocalAndServer<Family>(userProfileId, object, API.FAMILY.SAVE, updateFunc, true);
};

export const updateFamilyOtherInformation = function({
	userProfileId,
	object
}: IUpdateEnityPayload) {
	const updateFunc = (
		userProfile: UserProfile,
		familyOtherInformation: FamilyOtherInformation
	) => {
		userProfile.family = { ...userProfile.family };
		userProfile.family.familyOtherInformation = familyOtherInformation;
		return userProfile;
	};
	return updateLocalAndServer<FamilyOtherInformation>(
		userProfileId,
		object,
		API.FAMILY_OTHER_INFORMATION.SAVE,
		updateFunc,
		true
	);
};

export const updatePreference = function({ userProfileId, object }: IUpdateEnityPayload) {
	const updateFunc = (userProfile: UserProfile, preference: Preference) => {
		userProfile.preference = preference;
		return userProfile;
	};
	return updateLocalAndServer<Preference>(
		userProfileId,
		object,
		API.PREFERENCE.SAVE,
		updateFunc,
		true
	);
};

/**
 * @deprecated This should not be used anywhere.
 * This will return non-decorated user profiles. You should use search functions instead
 * Talk to @rjamwal first
 */
export const fetchUserProfiles = function() {
	return (dispatch: Dispatch<any>, getState: () => IRootState) => {
		console.log('userProfile.list');
		const selfProfileId = getSelfProfileId(getState());
		return ApiRequest(API.USER_PROFILE.LIST, {
			id: selfProfileId
		}).then((response: any) => {
			const userProfiles = response.content as Array<UserProfile>;
			userProfiles.forEach(profile => {
				dispatch(addProfile(profile));
			});
		});
	};
};

export const fetchUserProfile = function(currentUserId: number, userProfileId: number) {
	return (dispatch: Dispatch<any>, getState: () => IRootState) => {
		return ApiRequest(API.USER_PROFILE.GET, { currentUserId, userProfileId }).then(
			userProfile => {
				// console.log('fetch user profile answer', userProfile.totalKutasGained);
				dispatch(addProfile(userProfile as UserProfile));
				return userProfile;
			}
		);
	};
};

export const fetchHoroscopeCompatibility = function(userProfileId: number) {
	return (dispatch: Dispatch<any>, getState: () => IRootState) => {
		const currentUserId = getSelfProfileId(getState());
		if (!currentUserId) return null;
		if (!isAccountPaid(getState())) {
			return simpleAlert(
				'Purchase plan',
				'Kundali matching is available only on paid plans.'
			);
		}
		return ApiRequest(API.HOROSCOPE.MATCH, {
			currentUserId,
			userProfileId
		}).then(response => {
			// refetch profile
			return dispatch(fetchUserProfile(currentUserId, userProfileId));
		});
	};
};

export const userProfileReducer = handleActions<IUserProfileState>(
	{
		[BULK_ADD_PROFILE]: (state, { payload }) => {
			const profiles = (payload as any) as Array<UserProfile>;
			const profilesByKey: any = {};
			profiles.forEach(profile => {
				profilesByKey[profile.id] = profile;
			});
			return {
				...state,
				...profilesByKey
			};
		},
		[ADD_PROFILE]: (state, { payload }) => {
			const profile = (payload as any) as UserProfile;
			return { ...state, [profile.id]: profile };
		},
		[BLOCK_PROFILE]: (state, { payload }) => {
			const profile = (payload as any) as UserProfile;
			profile.isBlocked = true;
			return { ...state, [profile.id]: profile };
		},
		[UNBLOCK_PROFILE]: (state, { payload }) => {
			const profile = (payload as any) as UserProfile;
			profile.isBlocked = false;
			return { ...state, [profile.id]: profile };
		}
		// [UPDATE_VERIFICATION]: (state, { payload }) => state
	},
	defaultProfileState
);
