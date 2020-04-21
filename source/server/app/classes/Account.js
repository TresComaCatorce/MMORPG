/*
    Project: MMORPGServer
    Date: 28/03/2020
    Author: Cristian Ferrero

	Description: Account object, represents a user logged in to the system.
	Contains the characters.

*/

const Character = require('./Character');

module.exports = Account = class Account {
	
	constructor( accountData, client ) {
		const { _id, email, nickname, creation_date, last_login_date, characters } = accountData;

		this._id = _id;
		this.email = email;
		this.nickname = nickname;
		this.creation_date = Utils.formatDateWithHours( creation_date );
		this.last_login_date = Utils.formatDateWithHours( last_login_date );
		this.characters = characters;
		this.characterOnline = undefined;
		this.socket = client.socket;
		
		this.updateLastLoginDate();
		this.sendLoginData();
	}

	// Update "Last login date" of the account with the current date.
	updateLastLoginDate() {
		AccountModel.updateOne(
			{_id: this._id},
			{last_login_date: new Date()},
			{runValidators: true}
		);
	}

	// Send a packet to the client
	// @param [packetData] 'data': Packet to send to the client.
	broadcastSelf( data ) {
		return PacketManager.sendPacket( this.socket, data );
	}

	// Send login data to the client.
	sendLoginData() {
		const accountDataToSend = [
			Constants.PACKETS.S_LOGIN,
			true,
			this.email,
			this.nickname,
			this.creation_date,
			this.last_login_date
		];

		accountDataToSend.push(this.characters.length);

		this.characters.forEach( character => {
			accountDataToSend.push(character.name);
			accountDataToSend.push(character.race);
			accountDataToSend.push(character.level);
			accountDataToSend.push(character.account_slot);
		});

		this.broadcastSelf(accountDataToSend);
	}

	// If the account is already connected with one character.
	// @return [bool]
	isOnline() {
		return this.characterOnline !== undefined; 
	}

	// Enter with a character into game.
	// @param [string] 'characterName': Name of the character to enter in game.
	enterGame( characterName ) {
		const character =  this.characters.filter( character => character.name === characterName );
		const characterExist = () => ( Array.isArray(character) && character.length>0 );

		if( !this.isOnline() ) {
			if( characterExist() ) {
				this.characterOnline = new Character( character[0], this.socket );
			}
			else {
				console.log( "CBF Error: The character doesn't exist in that account".red );
			}
		}
		else {
			console.log("CBF Error: This account is already connected to the game with one character.".red );
		}
	}
}