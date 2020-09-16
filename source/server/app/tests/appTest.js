





// const Server = require('./classes/Server');

// // Se guarda una referencia global al path de la aplicacion.
//  global.appRoot = __dirname;

// const App = new Server();

 global.appRoot = __dirname;
const mongoose = require('mongoose');
global.Config = require('../initializers/00_configs');
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
global.gamedb = mongoose.createConnection( 'mongodb://127.0.0.1/CBF_TEST' );

const CharacterModel = require('../models/01_CharacterModel');
const AccountModel = require('../models/02_AccountModel');


const run = async () => {
	try {
		
		//-----------------------------------------------
		// CREATE ACCOUNT
		// const u1 = await AccountModel.register({
		// 	email: "test@test.com",
		// 	nickname: "test",
		// 	password: "qweasd40954"
		// });
		// console.log("CBF u1: ", u1);
		
		// const u2 = await AccountModel.register({
		// 	email: "test2@test.com",
		// 	nickname: "test2",
		// 	password: "qweasd40954"
		// });
		// console.log("CBF u2: ", u2);
		
		// const u3 = await AccountModel.register({
		// 	email: "test3@test.com",
		// 	nickname: "test3",
		// 	password: "qweasd40954"
		// });
		// console.log("CBF u3: ", u3);
		
		// const u4 = await AccountModel.register({
		// 	email: "cris@test.com",
		// 	nickname: "cris",
		// 	password: "qweasd40954"
		// });
		// console.log("CBF u4: ", u4);
		//-----------------------------------------------



		//-----------------------------------------------
		// FIND ACCOUNT BY ID
		// const x3 = await AccountModel.findById(
		// 	"THE_ACCOUNT_ID"
		// );
		// console.log("CBF account: ", x3);
		//-----------------------------------------------
		//-----------------------------------------------
		// FIND ACCOUNT BY NICKNAME
		// const x3 = await AccountModel.find(
		// 	{nickname: "test"}
		// );
		// console.log("CBF account: ", x3);
		//-----------------------------------------------


		


		//-----------------------------------------------
		// UPDATE LAST LOGIN DATE
		// const x2 = await AccountModel.update(
		// 	{nickname: "test"},
		// 	{last_login_date: new Date()},
		// 	{runValidators: true}
		// );
		// console.log("CBF x2: ", x2.n, x2.nModified)
		//-----------------------------------------------



		//-----------------------------------------------
		// CREATE CHARACTER
		const acc = await AccountModel.findOne({nickname: "test2"});
		const char = await CharacterModel.create({
			name: "TresComa",
			race: 0,
			level: 300,
			current_room: 1,
			pos_x: 100,
			pos_y: 100,
			account_slot: 2,
			account: acc._id
		});
		console.log("CBF char2: ", char);
		//-----------------------------------------------
		//-----------------------------------------------
		// ADD CHARACTER TO ACCOUNT
		// const char = await CharacterModel.findOne({ name: 'KriztiaN' });
		const account = await AccountModel.findOneAndUpdate(
			{nickname: "test2"},
			{$push:{characters: char._id}}
		);
		console.log("CBF acc2: ", account);
		//-----------------------------------------------



		//-----------------------------------------------
		// GET CHARACTER
		// const t = await CharacterModel.
		// findOne({ name: 'KriZ3' });
		// console.log("CBF T: ", t);
		//-----------------------------------------------
		//-----------------------------------------------
		// GET CHARACTER WITH ACCOUNT DATA POPULATED
		// const t = await CharacterModel.
		// findOne({ name: 'KriZ3' }).
		// populate('account');
		// console.log("CBF T: ", t);
		//-----------------------------------------------

		


		//-----------------------------------------------
		// GET ACCOUNT
		// const account = await AccountModel.findOne({nickname: "test"});
		// console.log("CBF acc: ", account);
		//-----------------------------------------------
		//-----------------------------------------------
		// GET ACCOUNT WITH CHARACTERS DATA POPULATED
		// const account = await AccountModel.findOne({nickname: "test"}).populate('characters');
		// console.log("CBF acc: ", account);
		//-----------------------------------------------
		

		
	} catch (error) {
		console.log(`CBF Error: ${error}`)
	}
}

run();
