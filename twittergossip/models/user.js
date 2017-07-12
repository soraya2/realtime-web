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

// Methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// Create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
