/*
    Project: MMORPGServer
    Date: 28/03/2020
    Author: Cristian Ferrero

    Description: Represents all renderizable entity ingame.

*/
const _ = require('underscore');

module.exports = Entity = class Entity {

	//#region CLASS FIELDS DECLARATION
	#id;
	#name;
	#typeId;
	#typeName;
	//#endregion



	//#region CONSTRUCTOR
	constructor(params={}) {
		const { id, typeId, name } = params;
		this.#setId( id );
		this.#setTypeId( typeId||-1 );
		this.#setName( name );
		this.#init();
	}
	//#endregion



	//#region GETTERS & SETTERS
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

	// Load all data of hentity
	#init() {
		this.#loadEntityDataFromConfigJson();
		this.#loadEntityTypeDataFromConfigJson();
	}

	// Load data from "entity.json"
	#loadEntityDataFromConfigJson() {
		const entityObj = Config.entities.getEntityById( this.getId() );
		if(entityObj) {
			this.#setName( entityObj.name );
			this.#setTypeId( entityObj.typeId );

			// Enemy entity attributes load
			(this.loadEnemyDataFromConfigJson) ? this.loadEnemyDataFromConfigJson(entityObj) : undefined;
		}
	}
	
	// Load data from "entityTypes.json"
	#loadEntityTypeDataFromConfigJson() {
		const entityTypeObj = Config.entityTypes[this.getTypeId()];
		if(entityTypeObj) {
			this.#setTypeName( entityTypeObj.name )
		}
	}

	//#endregion
}