// Bring Mongoose into the app 
var mongoose = require('mongoose'); 
 
// Build the connection string 
var dbURI = 'mongodb://10.211.55.21:27017/timezone'; 
 
// Create the database connection 
//mongoose.connect(dbURI);
mongoose.connect(dbURI, {useNewUrlParser: true});
mongoose.set('bufferCommands', false);

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + dbURI);
}); 
  
// If the connection throws an error
mongoose.connection.on('error',function (err) { 
  console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () { 
  console.log('Mongoose default connection disconnected'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {   
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
}); 
