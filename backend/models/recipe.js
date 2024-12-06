const mongoose = require('mongoose');

const commentSchema = mongoose.Schema(
    {
        text: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        username: { type: String, required: true } // Dodajemy pole username
    },
    {
        timestamps: true
    }
);

const recipeSchema = mongoose.Schema(
    {
        title: { type: String, required: true },
        ingredients: { type: String, required: true },
        instructions: { type: String, required: true },
        image: { type: String },
        user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        username: { type: String, required: true },
        comments: [commentSchema]
    },
    {
        timestamps: true
    }
);

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
