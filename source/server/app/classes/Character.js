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
		const { _id, name, race, level, current_room, pos_x, pos_y, account_slot,
			currentExp, nextLevelExp, currentHp, maxHp, currentMana, maxMana, currentStamina, maxStamina,
			statStrength, statDexterity, statVitality, statEnergy, statIntelligence, statSpirit, statWildness,
			} = characterData;
			
		super( _id, name, current_room, pos_x, pos_y );
		this.race = race;
		this.level = level;
		this.account_slot = account_slot;
		this.currentExp = currentExp;
		this.nextLevelExp = nextLevelExp;
		this.currentHp = currentHp;
		this.maxHp = maxHp;
		this.currentMana = currentMana;
		this.maxMana = maxMana;
		this.currentStamina = currentStamina;
		this.maxStamina = maxStamina;
		this.statStrength = statStrength;
		this.statDexterity = statDexterity;
		this.statVitality = statVitality;
		this.statEnergy = statEnergy;
		this.statIntelligence = statIntelligence;
		this.statSpirit = statSpirit;
		this.statWildness = statWildness;
		this.socket = socket;
		this.model = undefined;
		this.getCharacterModel();
		this.enterInRoom( this.current_room );
		this.sendCharacterConnectData();
		this.updateDaemon = this.initUpdateDaemon();
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
			this.pos_y,
			this.currentHp,
			this.maxHp,
			this.currentMana,
			this.maxMana,
			this.currentExp,
			this.nextLevelExp
		];

		this.broadcastSelf(characterData);
	}

	// Send a request
	sendUpdateRequest() {
		const updateData = [ Constants.PACKETS.S_UPDATE ];

		this.broadcastSelf(updateData);
	}

	// Init the update daemon of this character.
	initUpdateDaemon() {
		return setInterval( () => this.sendUpdateRequest(), Config.common.update_interval );
	}

	// Clear the update daemon of this character.
	clearUpdateDaemon() {
		clearInterval(this.updateDaemon);
	}
}