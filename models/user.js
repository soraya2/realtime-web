var mongoose = require('mongoose');

// Define the schema for our user model

var userSchema = mongoose.Schema({

    local: {
        email: String,
        password: String
    },

    twitter: {
        id: String,
        token: String,
        secret: String,
        displayName: String,
        username: String,
        tweets: Array,
        friends: Array,
        gameHighscore: String
    }
});



// Create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
