/*
    Project: MMORPGServer
    Date: 23/03/2020
    Author: Cristian Ferrero

    Description: Character object represents all connected clients to the server, only autenticated.

*/

const Entity = require('./Entity');

module.exports = Character = class Character extends Entity {
	
	constructor( characterData, socket ) {
		console.log("CBF char constructor: ", characterData );
		const { _id, name, race, level, hp, maxHp, mana, maxMana, current_room, pos_x, pos_y, account_slot } = characterData
		super( _id, name, current_room, pos_x, pos_y );
		this.race = race;
		this.level = level;
		this.account_slot = account_slot;
		this.socket = socket;
		this.model = undefined;
		this.hp = hp;
		this.maxHp = maxHp;
		this.mana = mana;
		this.maxMana = maxMana;
		this.getCharacterModel();
		this.enterInRoom( this.current_room );
		this.sendCharacterConnectData();
	}

	async getCharacterModel() {
		this.model = await CharacterModel.findOne({ name: this.name });
	}

	//Save character info in DB.
	save() {
		this.model.pos_x = this.pos_x;
		this.model.pos_y = this.pos_y;
		this.model.current_room = this.current_room;
		this.model.save();
	}

	enterInRoom() {
		World.addCharacterToRoom( this.current_room, this );
	}

	// Remove character from room
	exitRoom() {
		World.removeCharacterFromRoom( this.current_room, this );
	}

	// Funcion que envia un mensaje para el propio cliente.
	broadcastSelf( data ) {
		return PacketManager.sendPacket( this.socket, data );
	}


	// Funcion que envia un update a todos los clientes
    // que se encuentran en el room.
	broadcastRoom( data, sendToSelf = false ) {
		//Se recorre el array que contiene todos los clientes en ese room.
		//Y se ejecuta la funcion por cada uno de ellos.
		World.forEachCharacterInRoom( this.current_room, ( otherCharacter ) => {
			//Si el usuario actual NO es el usuario del array.
			//(No le queremos mandar esta info al mismo cliente)
			if( otherCharacter.name != this.name || sendToSelf ) {
				otherCharacter.broadcastSelf( data );
			};
		});
	}


	// Funcion que envia un update a todos los clientes
	// que se encuentran "cerca" del jugador.
	broadcastNearby( data, sendToSelf = false ) {
		World.forEachCharacterInRoom( this.current_room, ( otherCharacter ) => {
			const distX = Math.abs( otherCharacter.pos_x - this.pos_x );
			const distY = Math.abs( otherCharacter.pos_y - this.pos_y );

			if( ( otherCharacter.name !== this.name || sendToSelf ) &&
				distX<Config.common.nearby_distance.horizontal &&
				distY<Config.common.nearby_distance.vertical ) {
				otherCharacter.broadcastSelf( data );
			};
		})
	}

	// Tells to the client to enter in the game with this character.
	sendCharacterConnectData() {
		const characterData = [
			Constants.PACKETS.S_CHARACTER_CONNECT,
			this.name,
			this.level,
			this.race,
			this.current_room,
			this.pos_x,
			this.pos_y
		];

		this.broadcastSelf(characterData);
	}
}