const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });

const conectDB = async () => {
	try {
		await mongoose.connect(process.env.DB_MONGO, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false
		});
		console.log('DB Conected');
	} catch (error) {
		console.log(error);
		procces.exit(1); //Stop app
	}
};

module.exports = conectDB;
