// profile-form mapping export
export const mapping = {
	gender: {
		label: 'Gender',
		type: 'string',
		choice: {
			options: [
				{
					label: 'Male',
					value: 'male'
				},
				{
					label: 'Female',
					value: 'female'
				}
			]
		}
	},
	about: {
		label: 'About',
		type: 'about'
	},
	createdBy: {
		label: 'Profile created by',
		type: 'string',
		choice: {
			options: [
				{
					label: 'Self',
					value: 'self'
				},
				{
					label: 'Father',
					value: 'father'
				},
				{
					label: 'Mother',
					value: 'mother'
				},
				{
					label: 'Brother',
					value: 'brother'
				},
				{
					label: 'Sister',
					value: 'sister'
				},
				{
					label: 'Other',
					value: 'other'
				}
			]
		}
	},
	salutation: {
		label: 'Salutation',
		type: 'string',
		choice: {
			options: [
				{
					label: 'Mr.',
					value: 'mr'
				},
				{
					label: 'Miss.',
					value: 'miss'
				},
				{
					label: 'Dr.',
					value: 'dr'
				},
				{
					label: 'Prof.',
					value: 'prof'
				},
				{
					label: 'Mrs.',
					value: 'mrs'
				}
			]
		}
	},
	fullName: {
		label: 'Full Name',
		type: 'string'
	},
	/*dob: {
		label: 'Date of Birth',
		type: 'date'
	},*/
	maritalStatus: {
		label: 'Marital Status',
		type: 'string',
		choice: {
			options: [
				{
					label: 'Single',
					value: 'single'
				},
				{
					label: 'Divorced',
					value: 'divorced'
				}
			]
		}
	},
	height: {
		label: 'Height(in Feet)',
		type: 'string',
		choice: {
			options: [
				{
					label: 'Below 4.1',
					value: '<4.1'
				},
				{
					label: '4.1',
					value: '4.1'
				},
				{
					label: '4.2',
					value: '4.2'
				},
				{
					label: '4.3',
					value: '4.3'
				},
				{
					label: '4.4',
					value: '4.4'
				},
				{
					label: '4.5',
					value: '4.5'
				},
				{
					label: '4.6',
					value: '4.6'
				},
				{
					label: '4.7',
					value: '4.7'
				},
				{
					label: '4.8',
					value: '4.8'
				},
				{
					label: '4.9',
					value: '4.9'
				},
				{
					label: '4.9',
					value: '4.9'
				},
				{
					label: '4.10',
					value: '4.10'
				},
				{
					label: '4.11',
					value: '4.11'
				},
				{
					label: '5.0',
					value: '5.0'
				},
				{
					label: '5.1',
					value: '5.1'
				},
				{
					label: '5.2',
					value: '5.2'
				},
				{
					label: '5.3',
					value: '5.3'
				},
				{
					label: '5.4',
					value: '5.4'
				},
				{
					label: '5.5',
					value: '5.5'
				},
				{
					label: '5.6',
					value: '5.6'
				},
				{
					label: '5.7',
					value: '5.7'
				},
				{
					label: '5.8',
					value: '5.8'
				},
				{
					label: '5.9',
					value: '5.9'
				},
				{
					label: '5.10',
					value: '5.10'
				},
				{
					label: '5.11',
					value: '5.11'
				},
				{
					label: '6.0',
					value: '6.0'
				},
				{
					label: '6.1',
					value: '6.1'
				},
				{
					label: '6.2',
					value: '6.2'
				},
				{
					label: '6.3',
					value: '6.3'
				},
				{
					label: '6.4',
					value: '6.4'
				},
				{
					label: '6.5',
					value: '6.5'
				},
				{
					label: '6.6',
					value: '6.6'
				},
				{
					label: '6.7',
					value: '6.7'
				},
				{
					label: '6.8',
					value: '6.8'
				},
				{
					label: '6.9',
					value: '6.9'
				},
				{
					label: '6.10',
					value: '6.10'
				},
				{
					label: '6.11',
					value: '6.11'
				},
				{
					label: '7 or Above',
					value: '>=7'
				}
			]
		}
	},
	/*weight: {
		label: 'Weight(in KG)',
		type: 'number'
	},*/
	bodyType: {
		label: 'Body Type',
		type: 'string',
		choice: {
			options: [
				{
					label: 'Average',
					value: 'average'
				},
				{
					label: 'Athletic',
					value: 'athletic'
				},
				{
					label: 'Slim',
					value: 'slim'
				},
				{
					label: 'Heavy',
					value: 'heavy'
				}
			]
		}
	},
	bodyComplexion: {
		label: 'Body Complexion',
		type: 'string',
		choice: {
			options: [
				{
					label: 'Fair',
					value: 'fair'
				},
				{
					label: 'Very Fair',
					value: 'very-fair'
				},
				{
					label: 'Wheatish',
					value: 'wheatish'
				},
				{
					label: 'Wheatish Brown',
					value: 'wheatish-brown'
				},
				{
					label: 'Dark',
					value: 'dark'
				}
			]
		}
	},
	bloodGroup: {
		label: 'Blood Group',
		type: 'string',
		choice: {
			options: [
				{
					label: 'A +ve',
					value: 'a+ve'
				},
				{
					label: 'B +ve',
					value: 'b+ve'
				},
				{
					label: 'O +ve',
					value: 'o+ve'
				},
				{
					label: 'AB +ve',
					value: 'ab+ve'
				},
				{
					label: 'A -ve',
					value: 'a-ve'
				},
				{
					label: 'B -ve',
					value: 'b-ve'
				},
				{
					label: 'O -ve',
					value: 'o-ve'
				},
				{
					label: 'AB -ve',
					value: 'ab-ve'
				},
				{
					label: 'NA',
					value: 'na'
				},
				{
					label: 'Yet To Be Tested',
					value: 'to-be-tested'
				}
			]
		}
	},
	motherTongue: {
		label: 'Mother Tongue',
		type: 'string',
		choice: {
			options: [
				{
					label: 'Marathi',
					value: 'marathi'
				},
				{
					label: 'Hindi',
					value: 'hindi'
				},
				{
					label: 'English',
					value: 'english'
				},
				{
					label: 'Bengali',
					value: 'bengali'
				},
				{
					label: 'Telugu',
					value: 'telugu'
				},
				{
					label: 'Tamil',
					value: 'tamil'
				},
				{
					label: 'Urdu',
					value: 'urdu'
				},
				{
					label: 'Kannada',
					value: 'kannada'
				},
				{
					label: 'Gujrati',
					value: 'gujrati'
				},
				{
					label: 'Odia',
					value: 'odia'
				},
				{
					label: 'Malayalam',
					value: 'malayalam'
				},
				{
					label: 'Bhojpuri',
					value: 'bhojpuri'
				},
				{
					label: 'Punjabi',
					value: 'punjabi'
				},
				{
					label: 'Rajasthani',
					value: 'rajasthani'
				},
				{
					label: 'Chhattisgarhi',
					value: 'chhattisgarhi'
				},
				{
					label: 'Assamese',
					value: 'assamese'
				},
				{
					label: 'Maithili',
					value: 'maithili'
				},
				{
					label: 'Haryanvi',
					value: 'haryanvi'
				},
				{
					label: 'Marwari',
					value: 'marwari'
				},
				{
					label: 'Santali',
					value: 'santali'
				},
				{
					label: 'Malvi',
					value: 'malvi'
				},
				{
					label: 'Kashmiri',
					value: 'kashmiri'
				},
				{
					label: 'Mewari',
					value: 'mewari'
				},
				{
					label: 'Kokani',
					value: 'kokani'
				}
			]
		}
	}
	/*specialCases: {
		label: 'Special Cases',
		type: 'tag-array'
	},
	describeMyself: {
		label: 'I describe myself as',
		type: 'tag-array'
	}*/
};
