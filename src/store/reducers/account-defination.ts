/***
 * Type definition for the account & sub entities
 *
 * TODO: harden string types to enums as and when needed
 */

export interface WorldEntity {
	id: number;
	name: string;
}

export interface City extends WorldEntity {
	regionId: number;
	countryId: number;
}

export interface Region extends WorldEntity {
	code: number;
}

export interface Country extends WorldEntity {
	code: number;
}

export interface DAO {
	id?: number;
	createdOn: number;
	updatedOn: number;
	deletedOn?: number;
}

export interface Account extends DAO {
	payment: Payment;
	userProfile: UserProfile;
	countryCode: string;
	phoneNumber: string;
	token: string;
}

export interface Payment extends DAO {
	selectedPackage: string;
	registrationDate: number;
	expiryDate: number;
	receiptNumber: string;
	contactBalance: number;
}

export interface Verification extends DAO {
	address: boolean;
	identity: boolean;
	income: boolean;
}

export interface Tag extends DAO {
	tagId: string;
	value: string;
	tagType: string;
}

export interface UserProfile extends DAO {
	responseRate: number;
	responseTime: number;
	lastLogin: number;

	gender: string;
	about: string;
	createdBy: string;
	salutation: string;
	fullName: string;
	dob: number;
	maritalStatus: string;
	height: number;
	weight: number;
	bodyType: string;
	bodyComplexion: string;
	lenses: string;
	bloodGroup: string;
	motherTongue: string;
	isFavourite: boolean;
	totalKutasGained: number;
	isBlocked: boolean;
	pushToken: string;

	specialCases: Array<Tag>;
	describeMyself: Array<Tag>;

	verification: Verification;
	education: Education;
	profession: Profession;
	horoscope: Horoscope;
	investments: Investments;
	lifestyle: Lifestyle;
	otherDetails: OtherDetails;
	contactInformation: ContactInformation;
	userReference: UserReference;
	family: Family;
	preference: Preference;
	photo: PhotosEntity[];
}

export interface Education extends DAO {
	mediumOfPrimaryEducation: string;
	highestEducationLevel: string;
	educationField: string;
	education: string;
	additionalEducation: string;
	university: string;
}

export interface Profession extends DAO {
	occupation: string;
	workingField: string;
	lengthOfEmployment: number | null;
	company: string;
	designation: string;
	currency: string;
	monthlyIncome: number | null;
	annualIncome: number | null;
	loans: Array<Tag>;
	otherLoans: string;
	workCountry: Country | null;
	workState: Region | null;
	workCity: City | null;
}

export interface Horoscope extends DAO {
	caste: Array<Tag>;
	subCaste: Array<Tag>;
	birthPlace: string;
	birthTime: number;
	rashi: string;
	nakshatra: string;
	charan: string;
	gan: string;
	nadi: string;
	mangal: string;
	gotra: string;
	birthCity: City | null;
	wantToSeePatrika: boolean;
}

export interface Investments extends DAO {
	home: Array<Tag>;
	realEstate: Array<Tag>;
	vehicle: Array<Tag>;
	investments: Array<Tag>;
}

export interface Lifestyle extends DAO {
	diet: string;
	smoking: string;
	drinking: string;
	hoteling: string;
	partying: string;
	socialNetworking: Array<Tag>;
	priorities: Array<Tag>;
	hobbies: Array<Tag>;
	sports: Array<Tag>;
}

export interface OtherDetails extends DAO {
	medicalHistory: string;
	currentMedications: string;
	passport: boolean;
	visaDetails: string;
}

export interface ContactInformation extends DAO {
	phoneNumber: string;
	address: string;
	pinCode: string;
	residentialCity: string;
	mobileNumber1: string;
	mobileNumber1Of: string;
	mobileNumber2: string;
	mobileNumber2Of: string;
	landlineNumber: string;
	emailId: string;
	emailIdOf: string;
	alternateEmailId: string;
	alternateEmailIdOf: string;
	facebookLink: string;
	linkedinLink: string;
}

export interface UserReference extends DAO {
	relativeName: string;
	relationWithMember: string;
	contactNumber: string;
	address: string;
}

export interface Family extends DAO {
	fatherName: string;
	father: string;
	fatherOccupation: string;
	fatherDesignation: string;
	fatherNativePlace: string;
	motherName: string;
	mother: string;
	motherOccupation: string;
	motherDesignation: string;
	motherMaternalSurname: string;
	motherNativePlace: string;
	noOfBrothers: number | null;
	brothersMarried: number | null;
	noOfSisters: number | null;
	sistersMarried: number | null;
	aboutFamily: string;
	familyCountry: Country | null;
	familyState: Region | null;
	familyCity: City | null;
	interCasteParents: boolean;
	parentsLivingSeperately: boolean;
	familyOtherInformation: FamilyOtherInformation;
}

export interface FamilyOtherInformation extends DAO {
	familyValues: Array<Tag>;
	familyFinancialBackground: Array<Tag>;
	familyAnnualIncome: string;
	home: string;
	homeType: Array<Tag>;
	otherHomeType: Array<Tag>;
	realEstate: Array<Tag>;
	vehicle: boolean;
	vehicleType: Array<Tag>;
	loan: Array<Tag>;
	otherLoans: string;
	familyMedicalHistory: string;
}

export interface Preference extends DAO {
	maritalStatus: string;
	caste: Array<Tag>;
	subCaste: Array<Tag>;
	differenceHeight: string;
	differenceAge: string;
	educationLevel: Array<Tag>;
	education: string;
	mediumOfEducation: string;
	workingPartner: string;
	occupation: string;
	workCountry: Country | null;
	workState: Region | null;
	workCity: City | null;
	parentCountry: Country | null;
	parentState: Region | null;
	parentCity: City | null;
	diet: string;
	smoke: string;
	drink: string;
	hoteling: string;
	partying: string;
	cooking: string;
	familyFinancialBackground: Array<Tag>;
	familyValues: Array<Tag>;
	specialCase: Array<Tag>;
	otherExpectations: string;
	hideProfileFrom: string;
}

export interface PhotosEntity extends DAO {
	url: string;
	isApproved: boolean;
}

export interface FavouriteIdentity {
	favouriteProfileId: number;
	favouriteOfUserId: number;
}

export interface Favourite extends DAO {
	favouriteIdentity: FavouriteIdentity;
	favouriteOfUserProfile: UserProfile;
	favouriteUserProfile: UserProfile;
}

export interface InterestIdentity {
	fromUserId: number;
	toUserId: number;
}

export interface Interest extends DAO {
	interestIdentity: InterestIdentity;
	fromUser: UserProfile;
	toUser: UserProfile;
	status: string;
}

export interface MessageIdentity {
	channelId: number;
	id: number;
}

export interface Message extends DAO {
	fromUser: UserProfile;
	toUser: UserProfile;
	message: string;
	messageIdentity: MessageIdentity;
}

export interface ChannelIdentity {
	fromUserId: number;
	id: number;
	toUserId: number;
}

export interface Channel extends DAO {
	channelIdentity: ChannelIdentity;
	fromUser: UserProfile;
	toUser: UserProfile;
	latestMessage: any;
}

export interface Order extends DAO {
	amount: number;
	accountId: string;
	userProfileId: number;
	pgOrderId: string;
}

export interface PendingAccount extends DAO {
	phoneNumber: string;
	status: string;
	request: string;
}

export interface AccountRequest {
	phoneNumber: string;
	fullName: string;
	photoUrl: string;
	dob: number;
	gender: string;
}

export interface BlockedProfile extends DAO {
	byUserProfileId: number;
	blockedUserProfileId: number;
}

export interface Pageable {
	last: boolean;
	totalPages: number; // total page count
	number: number; // current page number
	totalElements: number;
}
