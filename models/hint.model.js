const mongoose = require('mongoose');
mongoose.pluralize(null);

const HintSchema = mongoose.Schema(
{
    identifier: {type: String, required: true},
    hint: { type: Array, required: true},
    dateUnlock: { type: Array, required: true}
});

module.exports = mongoose.model('Hints', HintSchema);