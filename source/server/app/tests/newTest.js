class A {

	#name;
	#helloo() {
		console.log("CBF helloo from A | name: ", this.getName() );
		this.hellooB ? this.hellooB('param') : undefined;
	}

	constructor() {
		this.#setName('I am A');
		this.#helloo();
	}

	//#region asdasdasdasd
	getName() {
		return this.#name;
	}

	#setName( value ) {
		this.#name = value;
	}
	//#endregion

}

class B extends A {
	constructor() {
		super();
	}

	hellooB(param) {
		console.log("CBF helloo from B: ", param);
	}
}

const newB = new B();
// console.log("CBF ", newB.name);
// newB.helloo();