const mongoose = require('mongoose');

const connectToDB = () => {
	const connectionString = process.env.CONNECTION_STRING;
	if (!connectionString) {
		console.error('connection string not defined');
		/**
		 * 正常退出
		 * 非正常退出
		 * 人为正常退出
		 * 人为非正常退出
		 */
		process.exit(1);
	}

	//xxx.xx@gmail.com
	const db = mongoose.connection;
	db.on('connected', () => {
		console.log(`DB connected, ${connectionString}`); //有时候connectionString里有密码
	});

	
	db.on('error', (error) => {
		console.error(error.message);
		process.exit(2);
	});

	db.on('disconnected', () => { //电脑休眠
		console.log('db connection lost');
	});

	return mongoose.connect(connectionString);
}

module.exports = connectToDB;
