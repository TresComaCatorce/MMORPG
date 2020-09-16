/*
    Project: MMORPGServer
    Date: 28/03/2020
    Author: Cristian Ferrero

    Description: This is an example.

*/

module.exports = ExampleBase = class ExampleBase {

	//#region CLASS FIELDS DECLARATION
	#name;
	//#endregion



	//#region CONSTRUCTOR
	constructor( params={} ) {
		const { name } = params;
		this.#setName( name );
		this.#init();
	}
	//#endregion



	//#region GETTERS & SETTERS
	getName() {
		return this.#name;
	}

	#setName( value ) {
		this.#name = value;
	}
	//#endregion



	//#region METHODS
	#init() {
		console.log('Hi there!');
	}
	//#endregion
}