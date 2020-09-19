const crypto = require('crypto');
const UserModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
//var jwtSecret = "my JWT secret";
var jwtSecret = "DMCHApcWplX3nSG/5DQiEYJOE3raUeuqJhXla8K4YDQm3g==";

/**
 * Sign up a new user
 */
exports.signup = (req, res) => {
console.log('SINGING UP:' + JSON.stringify(req.body));

	// Check if user already exist
	try {
		UserModel.findByEmail(req.body.email)
				 .then((result) => {
					if (result) {
						throw 'Email already exist!';
					}

					// Signing up
					let salt = crypto.randomBytes(16).toString('base64');
					let hash = crypto.createHmac('sha512', salt)
									.update(req.body.password)
									.digest("base64");
					req.body.password = salt + "$" + hash;
					if (!req.body.level) req.body.level = 1;
					UserModel.createUser(req.body)
							 .then((result) => {
								res.status(201).send({ id: result._id });
							 });
				 })
				 .catch((error) => {
					res.status(500).send({errors: error});
				 });
	}
	catch (err) {
		res.status(500).send({errors: err});
	}
};

/**
 * Find a user by email
 */
exports.user_by_email = (req, res) => {
	try {
		UserModel.findByEmail(req.params.email)
				 .then((result) => {
					if (result) {
						res.status(200).send(result);
					}
					else {
						res.status(200).send({result: 0});
					}
				 })
				 .catch((error) => {
					res.status(500).send({errors: error});
				 });
	}
	catch (err) {
		res.status(500).send({errors: err});
	}
};

/**
 * Find all users
 */
exports.users = (req, res) => {
	UserModel.findAll().then((result) => {
		res.status(200).send(result);
	});
};

/**
 * Delete a user by email
 */
exports.delete_by_email = (req, res) => {
	try {
		UserModel.deleteByEmail(req.params.email)
				 .then((result) => {
					if (result) {
						res.status(200).send(result);
					}
					else {
						res.status(200).send({result: 0});
					}
				 })
				 .catch((error) => {
					res.status(500).send({errors: error});
				 });
	}
	catch (err) {
		res.status(500).send({errors: err});
	}
};

/**
 * Update a user by email.  Only password can be updated
 */
exports.patch_by_email = (req, res) => {
	if (req.body.password){
		let salt = crypto.randomBytes(16).toString('base64');
		let hash = crypto.createHmac('sha512', salt)
						 .update(req.body.password)
						 .digest("base64");
		req.body.password = salt + "$" + hash;
	}
	UserModel.patchPswd(req.params.email, req.body).then((result) => {
           res.status(204).send({});
   });
};

/**
 * Login and retun tokens
 */
exports.login = (req, res) => {
console.log('LOGGING IN:' + JSON.stringify(req.body));
	try {
		let refreshId = req.body.email + jwtSecret;
		let salt = crypto.randomBytes(16).toString('base64');
		let hash = crypto.createHmac('sha512', salt).update(refreshId).digest("base64");
		req.body.refreshKey = salt;
		let token = jwt.sign(req.body, jwtSecret);
		let b = new Buffer(hash);
		let refresh_token = b.toString('base64');
		res.status(201).send({accessToken: token, refreshToken: refresh_token, userEmail: req.body.email, userLevel: req.body.level});
	} 
	catch (err) {
		res.status(500).send({errors: err});
	}
};

/**
 * Stateless backend.  Should not call
 */
exports.logout = function (req, res, next) {
console.log('LOGGING OUT:' + JSON.stringify(req.body));
	//req.logout();
	//req.session.destroy();
	//res.redirect('/');
	res.status(200).send("logout successful");
}