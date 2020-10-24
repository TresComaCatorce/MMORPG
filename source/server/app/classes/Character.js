/*
    Project: MMORPGServer
    Date: 23/03/2020
    Author: Cristian Ferrero

    Description: Character object represents all connected clients to the server, only autenticated.

*/

const Entity = require('./Entity');
const HPFunctionality = require('./HPFunctionality');
const Position = require('./Position');

//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// ADD 'clearSocket()' function (Called in Client.js)
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

module.exports = Character = class Character extends Entity {

	//#region CLASS FIELDS DECLARATION
	#accountSlot;
	#position;
	#HP;
	#mana
	#race;
	#level;
	#experience;
	#socket;
	#model;
	#updateDaemon;
	//#endregion



	//#region CONSTRUCTOR
	constructor( characterData ) {
		const { socket, _id, name, race, level, roomCode, x, y, accountSlot,
			currentExp, nextLevelExp, currentHP, maxHP, currentMana, maxMana, currentStamina, maxStamina,
			statStrength, statDexterity, statVitality, statEnergy, statIntelligence, statSpirit, statWildness,
			} = characterData;
			
		super({
			id: _id,
			typeId: Config.entityTypes.CHARACTER.id,
			name: name
		});

		this.#setAccountSlot( accountSlot );
		this.#setPosition( new Position({ x, y, roomCode, direction: -1 }) );
		this.#setHP( new HPFunctionality({ currentHP, maxHP }) );
		this.#setSocket( socket );

		this.#loadCharacterModel();
		this.#enterInRoom( this.getPosition().getRoomCode() );
		this.#sendCharacterConnectData();
		this.#setUpdateDaemon( this.#initUpdateDaemon() );
	}
	//#endregion



	//#region GETTERS & SETTERS
	getAccountSlot() {
		return this.#accountSlot;
	}
	#setAccountSlot( value ) {
		if( !isNaN(value) ) {
			this.#accountSlot = value;
		}
	}

	getPosition() {
		return this.#position;
	}
	#setPosition( value ) {
		if( value instanceof Position ) {
			this.#position = value;
		}
	}

	getHP() {
		return this.#HP;
	}
	#setHP( value ) {
		if( value instanceof HPFunctionality ) {
			this.#HP = value;
		}
	}

	getSocket() {
		return this.#socket;
	}
	#setSocket( value ) {
		if( Utils.exist(value) ) {
			this.#socket = value;
		}
		else {
			throw( new Error(` Character.js | Attempt to add a null value into 'socket'.`) );
		}
	}
	clearSocket() {
		this.#socket = undefined;
	}

	getModel() {
		return this.#model;
	}
	#setModel( value ) {
		if( Utils.exist(value) ) {
			this.#model = value;
		}
	}

	#getUpdateDaemon() {
		return this.#updateDaemon;
	}
	#setUpdateDaemon( value ) {
		if( Utils.exist(value) ) {
			this.#updateDaemon = value;
		}
	}
	//#endregion



	//#region METHODS
	async #loadCharacterModel() {
		const characterModel = await CharacterModel.findOne({ name: this.getName() });
		this.#setModel( characterModel );
	}

	//Save character info in DB.
	save() {
		this.getModel().x = this.getPosition().getX();
		this.getModel().y = this.getPosition().getY();
		this.getModel().roomCode = this.getPosition().getRoomCode();
		this.getModel().save();
	}

	#enterInRoom() {
		World.addCharacterToRoom( this.getPosition().getRoomCode(), this );
	}

	// Remove character from room
	exitRoom() {
		World.removeCharacterFromRoom( this.getPosition().getRoomCode(), this );
	}

	// Funcion que envia un mensaje para el propio cliente.
	broadcastSelf( data ) {
		return PacketManager.sendPacket( this.getSocket(), data );
	}


	// Send a packet to all character where are in the same room of this character.
	// @param <Array> 'packetData': Data to send.
	// @param <bool> 'sendToSelf': Flag to send the data also to itself.
	broadcastRoom( data, sendToSelf = false ) {
		World.forEachCharacterInRoom( this.getPosition().getRoomCode(), ( otherCharacter ) => {
			//Si el usuario actual NO es el usuario del array.
			//(No le queremos mandar esta info al mismo cliente)
			if( otherCharacter.name != this.getName() || sendToSelf ) {
				otherCharacter.broadcastSelf( data );
			};
		});
	}


	// Send a packet to all characters where are nearby to this character.
	// @param <Array> 'packetData': Data to send.
	// @param <bool> 'sendToSelf': Flag to send the data also to itself.
	broadcastNearbyCharacters( data, sendToSelf=false ) {
		World.forEachCharacterInRoom( this.getPosition().getRoomCode(), ( otherCharacter ) => {
			const distX = Math.abs( otherCharacter.getPosition().getX() - this.getPosition().getX() );
			const distY = Math.abs( otherCharacter.getPosition().getY() - this.getPosition().getY() );

			if( ( otherCharacter.getName() !== this.getName() || sendToSelf ) &&
				distX<Config.common.nearby_distance.horizontal &&
				distY<Config.common.nearby_distance.vertical ) {
				otherCharacter.broadcastSelf( data );
			};
		})
	}

	// Tells to the client to enter in the game with this character.
	#sendCharacterConnectData() {
		const characterData = [
			Constants.PACKETS.S_CHARACTER_CONNECT,
			this.getName(),
			1, //Level
			0, //race
			this.getPosition().getRoomCode(),
			this.getPosition().getX(),
			this.getPosition().getY(),
			this.getHP().getCurrentHP(),
			this.getHP().getMaxHP(),
			35, // current mana
			50, // max mana
			0, // current exp
			100 // next level exp
		];

		this.broadcastSelf(characterData);
	}

	// Send a request
	#sendUpdateRequest() {
		const updateData = [ Constants.PACKETS.S_UPDATE ];

		this.broadcastSelf( updateData );
	}

	// Init the update daemon of this character.
	#initUpdateDaemon() {
		return setInterval( () => this.#sendUpdateRequest(), Config.common.character_update_interval_time );
	}

	// Clear the update daemon of this character.
	clearUpdateDaemon() {
		clearInterval(this.#getUpdateDaemon());
	}
	//#endregion
	
}