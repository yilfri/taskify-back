const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
	// Read token.
	const token = req.header('x-auth-token');

	//Check if have token.
	if (!token) {
		return res.status(401).json({ msg: 'No have token, invalid permission' });
	}

	//Validate Token.
	try {
		const encryption = jwt.verify(token, process.env.SECRET);
		req.user = encryption.user;
		next();
	} catch (error) {
		res.status(401).json({ msg: 'Invalid Token' });
	}
};
