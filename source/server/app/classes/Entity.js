/*
    Project: MMORPGServer
    Date: 28/03/2020
    Author: Cristian Ferrero

    Description: Represents all renderizable entity ingame.

*/
const { v4: uuidv4 } = require('uuid');

module.exports = Entity = class Entity {

	//#region CLASS FIELDS DECLARATION
	#uId
	#id;
	#name;		// Loaded from "entities.json" file
	#typeId;	// Loaded from "entities.json" file
	#typeName;	// Loaded from "entities.json" file
	//#endregion



	//#region CONSTRUCTOR
	constructor(params={}) {
		const { id, typeId, name } = params;
		this.#setUId( uuidv4() );
		this.#setId( id );
		this.#setTypeId( typeId||-1 );
		this.#setName( name );
		this.#init();
	}
	//#endregion



	//#region GETTERS & SETTERS
	getUId() {
		return this.#uId;
	}
	#setUId(value) {
		this.#uId = value;
	}

	getId() {
		return this.#id;
	}

	#setId( value ) {
		this.#id = value;
	}

	getName() {
		return this.#name;
	}

	#setName( value ) {
		this.#name = value;
	}

	getTypeId() {
		return this.#typeId;
	}

	#setTypeId( value ) {
		this.#typeId = value;
	}

	getTypeName() {
		return this.#typeName;
	}

	#setTypeName( value ) {
		this.#typeName = value;
	}
	//#endregion



	//#region METHODS

	// Load all data of entity
	#init() {
		this.#loadEntityDataFromConfigJson();
		this.#loadEntityTypeDataFromConfigJson();
	}

	// Load data from 'entity.json'
	#loadEntityDataFromConfigJson() {
		const entityObj = Config.entities.getEntityById( this.getId() );
		if( this.getTypeId() != Config.entityTypes.CHARACTER.id ) {
			if( entityObj ) {
				this.#setName( entityObj.name );
				this.#setTypeId( entityObj.typeId );
			}
			else {
				throw( new Error(` Entity.js | entityId: '${this.getId()}' not found in <entities.json> file.`) );
			}
		}
	}
	
	// Load data from 'entityTypes.json'
	#loadEntityTypeDataFromConfigJson() {
		const entityTypeObj = Config.entityTypes[this.getTypeId()];
		if( entityTypeObj ) {
			this.#setTypeName( entityTypeObj.name )
		}
	}

	//#endregion
}