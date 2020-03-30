



//Require de la libreria JS mongoose.
//Se guarda una referencia global al path de la aplicacion.
global.appRoot = __dirname;
require('./initializers/00_config_loader');
const AccountSchema = require('./models/AccountSchema');

var newAccount = AccountSchema.register({
	email: "test@test.com",
	nickname: "user14",
	password: "sdfgfdgsdfg"
	// characters:
	// [
	// 	{
	// 		name: "Character3",
	// 		level: 5,
	// 		pos_x: 125,
	// 		pos_y: 125
	// 	},
	// 	{
	// 		name: "Character4",
	// 		level: 150,
	// 		pos_x: 325,
	// 		pos_y: 525
	// 	},
	// 	{
	// 		name: "Character5",
	// 		level: 150,
	// 		pos_x: 325,
	// 		pos_y: 525
	// 	},
	// 	{
	// 		name: "Character6",
	// 		level: 150,
	// 		pos_x: 325,
	// 		pos_y: 525
	// 	},
	// 	{
	// 		name: "Character7",
	// 		level: 150,
	// 		pos_x: 325,
	// 		pos_y: 525
	// 	}
	// ]
});;

// newAccount.save( ( err, accountSaved ) => {
// 	console.log("CBF succ save: ", err, accountSaved);
// });

console.log("CBF ee: ", newAccount);
