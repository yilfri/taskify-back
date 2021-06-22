const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.authUser = async (req, res) => {
	// Check if have errors.
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	// Destructuring email & password.
	const { email, password } = req.body;

	try {
		// Check if user is already register.
		let user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ msg: 'User does not exist' });
		}

		// Check password.
		const passCorrect = await bcryptjs.compare(password, user.password);
		if (!passCorrect) {
			return res.status(400).json({ msg: 'Incorrect password' });
		}

		// Create JWT.
		const payload = {
			user: {
				id: user.id
			}
		};

		// Sign JWT.
		jwt.sign(
			payload,
			process.env.SECRET,
			{
				expiresIn: 3600000
			},
			(error, token) => {
				if (error) throw error;

				// Corfirm message.
				res.json({ token });
			}
		);
	} catch (error) {
		console.log(error);
	}
};

//Getting user authenticated
exports.userAuthenticated = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		res.json({ user });
	} catch (error) {
		console.log(error);
		res.status(500).json({ msg: 'Have a error' });
	}
};
