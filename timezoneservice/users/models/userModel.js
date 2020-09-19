var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const userSchema = new Schema({
	email: String,
	password: String,
	level: Number
});

const userModel = mongoose.model('user', userSchema, 'user');

exports.createUser = (userData) => {
    const user = new userModel(userData);
    return user.save();
};

exports.findByEmail = (email) => {
	return userModel.findOne({email : email})
					.then((result) => {
						if (result) {
							result = (result) ? result.toJSON() : '{}'.toJSON;
							delete result.__v;
							return result;
						}
						else return null;
					})
					.catch((error) => {
						console.log(error);
						return null;
					});
};

exports.deleteByEmail = (email) => {
	return userModel.deleteOne({email : email})
					.then((result) => {
						return result;
					})
					.catch((error) => {
						console.log(error);
						return null;
					});
}

exports.findAll = () => {
	var a = [];
	return userModel.find({})
					.then((result) => {
						result.forEach((user) => {
							console.log(user);
							a.push(user.toJSON());
						});
						return a;
					});
};

exports.patchPswd = (email, userData) => {
	return userModel.updateOne(
						{ email : email }, 							// Filter
						{ $set : {"password": userData.password} },	// Update
						{ upsert : false })
					.then((result) => {
        				return result;
    				});
};
