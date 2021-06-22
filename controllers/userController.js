const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
	// Check if have errors.
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	// Destructuring
	const { email, password } = await req.body;

	try {
		// Check unique user.
		let user = await User.findOne({ email });

		if (user) {
			return res.status(400).json({ msg: 'User already exists ' });
		}

		// Create new User.
		user = new User(req.body);

		// Hash password.
		const salt = await bcryptjs.genSalt(10);
		user.password = await bcryptjs.hash(password, salt);

		// Save user.
		await user.save();

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
		res.status(400).send('Invalid information. Try again');
	}
};
