class A {
	constructor(name) {
		this.name = name;
	}
	doSomething() {

	}
}


const inst1 = new A("hola1");
const inst2 = new A("hola2");

const x = [inst1, inst2];

console.log(x.filter(item => item==inst2))