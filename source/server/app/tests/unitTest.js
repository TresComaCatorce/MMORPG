class A {
	#items=[];

	constructor() {

	}

	getItems() {
		return this.#items;
	}

	#setItems(value) {
		if(Array.isArray(value)) {
			this.#items = value;
		}
	}

	addItem(itemToAdd) {
		this.getItems().push(itemToAdd);
	}
}

const insta = new A();
insta.addItem("a");
insta.addItem("b");
console.log("CBF : ", insta.getItems(), insta.getItems().length );