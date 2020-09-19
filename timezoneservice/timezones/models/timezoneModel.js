var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const timezoneSchema = new Schema({
	email: String,
	city: String,
	timezone: String,
	offset: Number
});

const TimezoneModel = mongoose.model('timezone', timezoneSchema, 'timezone');

exports.createTimezone = (timezoneData) => {
    const tz = new TimezoneModel(timezoneData);
    return tz.save();
};

exports.findByEmail = (email) => {
	var a = [];
	return TimezoneModel.find({email : email})
						.then((result) => {
							result.forEach((tz) => {
								console.log(tz);
								a.push(tz.toJSON());
							});
							return a;
						})
						.catch((error) => {
							console.log(error);
							return null;
						});
};

exports.deleteByEmail = (email, id) => {
	return TimezoneModel.deleteOne({email : email, _id : id})
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
	return TimezoneModel.find({})
						.then((result) => {
							result.forEach((tz) => {
								console.log(tz);
								a.push(tz.toJSON());
							});
							return a;
						});
};
