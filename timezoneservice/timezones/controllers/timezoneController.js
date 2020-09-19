const crypto = require('crypto');
const TimezoneModel = require('../models/timezoneModel');
const jwt = require('jsonwebtoken');
//var jwtSecret = "my JWT secret";
var jwtSecret = "DMCHApcWplX3nSG/5DQiEYJOE3raUeuqJhXla8K4YDQm3g==";

exports.add_timezone = (req, res) => {
	TimezoneModel.createTimezone(req.body)
			 .then((result) => {
				res.status(201).send({ id: result._id });
			 });
};

exports.timezone_by_email = (req, res) => {
	try {
		TimezoneModel.findByEmail(req.params.email)
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

exports.timezones = (req, res) => {
	TimezoneModel.findAll().then((result) => {
		res.status(200).send(result);
	});
};

exports.delete_by_email = (req, res) => {
	try {
		TimezoneModel.deleteByEmail(req.params.email, req.params.id)
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

exports.patch_by_email = (req, res) => {
	if (req.body.password){
		let salt = crypto.randomBytes(16).toString('base64');
		let hash = crypto.createHmac('sha512', salt)
						 .update(req.body.password)
						 .digest("base64");
		req.body.password = salt + "$" + hash;
	}
	TimezoneModel.patchPswd(req.params.email, req.body).then((result) => {
           res.status(204).send({});
   	});
};
