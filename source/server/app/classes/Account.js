/*
    Project: MMORPGServer
    Date: 28/03/2020
    Author: Cristian Ferrero

	Description: Account object, represents a user logged in to the system.
	Contains the characters.

*/

const Character = require('./Character');


module.exports = Account = class Account {
	
	//#region CLASS FIELDS DECLARATION
	#id;
	#email;
	#nickname;
	#creationDate;
	#lastLoginDate;
	#characters = [];
	#characterOnline;
	#socket;
	//#endregion



	//#region CONSTRUCTOR
	constructor( accountData, client ) {
		const { _id, email, nickname, creationDate, lastLoginDate, characters } = accountData;

		this.#setId( _id );
		this.#setEmail( email );
		this.#setNickname( nickname );
		this.#setCreationDate( creationDate );
		this.#setLastLoginDate( lastLoginDate );
		this.#setCharacters( characters );
		this.#setSocket( client.getSocket() );
		
		this.#updateLastLoginDate();
		this.#sendLoginData();
	}
	//#endregion



	//#region GETTERS & SETTERS
	getId() {
		return this.#id;
	}
	#setId( value ) {
		if( Utils.exist(value) ) {
			this.#id = value;
		}
	}

	getEmail() {
		return this.#email;
	}
	#setEmail( value ) {
		if( Utils.exist(value) ) {
			this.#email = value;
		}
	}

	getNickname() {
		return this.#nickname;
	}
	#setNickname( value ) {
		if( Utils.exist(value) ) {
			this.#nickname = value;
		}
	}

	getCreationDate() {
		return this.#creationDate;
	}
	#setCreationDate( value ) {
		if( Utils.exist(value) ) {
			this.#creationDate = Utils.formatDateWithHours( value );
		}
	}

	getLastLoginDate() {
		return this.#lastLoginDate;
	}
	#setLastLoginDate( value ) {
		if( Utils.exist(value) ) {
			this.#lastLoginDate = Utils.formatDateWithHours( value );
		}
	}
	
	getCharacters() {
		return this.#characters;
	}
	#setCharacters( value ) {
		if( Utils.isNotEmptyArray(value) ) {
			this.#characters = value;
		}
	}
	
	getCharacterOnline() {
		return this.#characterOnline;
	}
	#setCharacterOnline( value ) {
		if( value instanceof Character ) {
			this.#characterOnline = value;
		}
	}
	clearCharacterOnline() {
		this.#characterOnline = undefined;
	}
	
	getSocket() {
		return this.#socket;
	}
	#setSocket( value ) {
		if( Utils.exist(value) ) {
			this.#socket = value;
		}
		else {
			throw( new Error(` Account.js | Attempt to add a null value into 'socket'.`) );
		}
	}
	clearSocket() {
		this.#socket = undefined;
	}
	//#endregion



	//#region METHODS
	// Update "Last login date" of the account with the current date.
	#updateLastLoginDate() {
		AccountModel.updateOne(
			{ _id: this.getId() },
			{ lastLoginDate: new Date() },
			{ runValidators: true }
		);
	}

	// Send a packet to the client
	// @param [packetData] 'data': Packet to send to the client.
	#broadcastSelf( data ) {
		return PacketManager.sendPacket( this.getSocket(), data );
	}

	// Send login data to the client.
	#sendLoginData() {
		const accountDataToSend = [
			Constants.PACKETS.S_LOGIN_SUCCESS,
			this.getEmail(),
			this.getNickname(),
			this.getCreationDate(),
			this.getLastLoginDate()
		];

		accountDataToSend.push( this.getCharacters().length );

		this.getCharacters().forEach( character => {
			accountDataToSend.push( character.name );
			accountDataToSend.push( character.race );
			accountDataToSend.push( character.level );
			accountDataToSend.push( character.accountSlot );
		});

		this.#broadcastSelf( accountDataToSend );
	}

	// If the account is already connected with one character.
	// @return [bool]
	isOnline() {
		return this.getCharacterOnline() !== undefined; 
	}

	// Enter with a character into game.
	// @param [string] 'characterName': Name of the character to enter in game.
	enterGame( characterName ) {
		const character =  this.getCharacters().filter( character => character.name === characterName );
		const characterExist = () => ( Array.isArray(character) && character.length>0 );

		if( !this.isOnline() ) {
			if( characterExist() ) {
				this.#setCharacterOnline( new Character({ ...character[0]._doc, socket: this.getSocket() }) );
			}
			else {
				throw( new Error(` Account.js | The character doesn't exist in that account.`) );
			}
		}
		else {
			throw( new Error(` Account.js | Account already connected.`) );
		}
	}
	//#endregion

	

	
}