const mongoose = require('mongoose');
mongoose.pluralize(null);

const UserSchema = mongoose.Schema(
{
    address: { type: String, required: true},
    hint: { type: Array, required: false, default: []},
    admin: { type: Boolean, required: false, default: false},
    token: { type: String, default: ""},
});

module.exports = mongoose.model('Users', UserSchema);