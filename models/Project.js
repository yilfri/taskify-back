const mongoose = require('mongoose');

const ProjectScheme = mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	creation_date: {
		type: Date,
		default: Date.now()
	}
});

module.exports = mongoose.model('Project', ProjectScheme);
