/*
    Project: MMORPGServer
    Date: 28/03/2020
    Author: Cristian Ferrero

    Esquema de la coleccion <user> de la base de datos.n
*/

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema
({
	email: {
		type: String,
		required: true,
		unique: true,
		match: [
			new RegExp(Config.common.validations.account_email.regex),
			Config.common.validations.account_email.message
		],
		minlength: 8,
		maxlength: 254
	},
	nickname: {
		type: String,
		required: true,
		unique: true,
		match: [
			new RegExp(Config.common.validations.account_nickname.regex),
			Config.common.validations.account_nickname.message
		]
	},
	password: {
		type: String,
		required: true,
		match: [
			new RegExp(Config.common.validations.account_password.regex),
			Config.common.validations.account_password.message
		], 
		select: false
	},
	creationDate: {
		type: Date,
		default: Date.now
	},
	lastLoginDate: {
		type: Date,
		default: Date.now
	},
	characters: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Character'
	}]
});

// Password encryptation (NO ARROW FUNCTION NEEDED)
accountSchema.pre( "save", async function( next )
{
	if ( !this.isModified('password') ) {
		return next();
	}

	const hash = await bcrypt.hash( this.password, 10 );
	this.password = hash;
	return next();	
});

// Login method with email address
accountSchema.statics.login = async ( data ) => {
	const {nickname, email, password} = data;
	const queryParam = {};

	//Build query param. "nickname" or "email" who corresponds.
	nickname ? queryParam.nickname = nickname : undefined;
	email ? queryParam.email = email : undefined;
	
	//Get user
	const accountData = await AccountModel.findOne( queryParam ).select('+password').populate('characters');
	if( !accountData ) {
		throw new Error('Account invalid');
	}

	//Check password
	const correctPassword = await accountData.checkPassword(password);
	if( !correctPassword ) {
		throw new Error('Password invalid');
	}
	
	accountData.password = undefined;
	
	return accountData;
}

// Register a new account
accountSchema.statics.register = async( data ) => {
	//Deasembly object to control stored data
	const {email, nickname, password} = data;

	var newAccount = new AccountModel({
		email,
		nickname,
		password
	});

	return await newAccount.save();
};

// Password verification (encrypted) (NO ARROW FUNCTION MANDATORY)
accountSchema.methods.checkPassword = async function( password ) {
	return await bcrypt.compare( password, this.password );
};

// Create a character and add to the account.
accountSchema.methods.addCharacter = async function( characterData ) {
	const { name, race } = characterData;
	const character = new CharacterModel.create(characterData);

	const savedCharacter = await character.save();

	if( !savedCharacter ) {
		throw new Error('Problem creating character');
	}

	// this.characters.push( character );
	// this.characters.push(characterData);
	
	return await this.save();
}

// Change password (NO ARROW FUNCTION MANDATORY)
accountSchema.methods.changePassword = async function( newPassword ) {
	this.password = newPassword;
	return await this.save();
};

module.exports = AccountModel = gamedb.model('Account', accountSchema);

