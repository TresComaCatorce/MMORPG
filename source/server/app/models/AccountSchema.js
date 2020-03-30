/*
    Project: MMORPGServer
    Date: 28/03/2020
    Author: Cristian Ferrero

    Esquema de la coleccion <user> de la base de datos.n
*/

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

//Configs
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

//Se conecta a la base de datos.
const gamedb = mongoose.createConnection( 'mongodb://127.0.0.1/CBF_TEST' );

const AccountSchema = new mongoose.Schema
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
		]
	},
	creation_date: Date,
	last_login_date: Date,
	characters: [{
		name: {
			type: String,
			required: true,
			unique: true,
			match: [
				new RegExp(Config.common.validations.character_name.regex),
				Config.common.validations.character_name.message
			]
		},
		level: {
			type: Number,
			min: 1,
			max: Config.common.max_level
		},
		pos_x: {
			type: Number,
			min: 0
		},
		pos_y: {
			type: Number,
			min: 0
		},
	}]
});

// Password encryptation (NO ARROW FUNCTION NEEDED)
AccountSchema.pre( "save", async function( next )
{
	const hash = await bcrypt.hash( this.password, 10 );
	this.password = hash;
	next();	
});

// Login method with nickname
AccountSchema.statics.loginWithNickname = async ( data ) => {
	const {nickname, password} = data;
	const accountData = await AccountSchema.findOne( {nickname} );
	
	if( !accountData )
	{
		return done( new Error("Account or password invalid"), null );
	}
	
	const correctPassword = await accountData.checkPassword(password);
	
	if( !correctPassword )
	{
		return done( new Error("Account or password invalid"), null );
	}
	
	return done( null, accountData );
}

// Login method with email address
AccountSchema.statics.loginWithEmailAddress = async ( data ) => {
	const {email, password} = data;
	const accountData = await AccountSchema.findOne( {email} );
	
	if( !accountData )
	{
		return done( new Error("Account or password invalid"), null );
	}
	
	const correctPassword = await accountData.checkPassword(password);
	
	if( !correctPassword )
	{
		return done( new Error("Account or password invalid"), null );
	}
	
	return done( null, accountData );
}

// Register a new account
AccountSchema.statics.register = async( data ) => {
	//Deasembly object to control stored data
	const {email, nickname, password} = data;
	var newAccount = new AccountSchema({
		email,
		nickname,
		password
	});

	return await newAccount.save();
};

// Password verification (encrypted) (NO ARROW FUNCTION NEEDED)
AccountSchema.methods.checkPassword = async function( password ) {
	return await bcrypt.compare( password, this.password );
};

module.exports = AccountModel = gamedb.model('Account', AccountSchema);
