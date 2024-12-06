const Recipe = require('../models/recipe');
const fs = require('fs');
const path = require('path');


const deleteFile = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Failed to delete file:', err);
        }
    });
};

const getRecipes = async (req, res) => {
    try {
        const { search, sort } = req.query;
        let query = Recipe.find();

        if (search) {
            query = query.where('title').regex(new RegExp(search, 'i'));
        }

        if (sort) {
            if (sort === 'oldest') {
                query = query.sort('createdAt');
            } else if (sort === 'a-z') {
                query = query.sort('title');
            } else if (sort === 'z-a') {
                query = query.sort('-title');
            } else {
                query = query.sort('-createdAt'); 
            }
        }

        const recipes = await query.populate('user', 'username');
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id).populate('user', 'username').populate('comments.user', 'username');
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        res.json(recipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




const createRecipe = async (req, res) => {
    const { title, ingredients, instructions } = req.body;
    const image = req.file ? req.file.filename : '';
    try {
        console.log('Received data:', { title, ingredients, instructions, image, username: req.user.username }); // Log received data
        const recipe = new Recipe({ 
            title, 
            ingredients, 
            instructions, 
            user: req.user._id, 
            username: req.user.username, // Ensure username is set
            image 
        });
        const createdRecipe = await recipe.save();
        res.status(201).json(createdRecipe);
    } catch (error) {
        console.error('Error creating recipe:', error); // Log error
        res.status(400).json({ message: error.message });
    }
};


const updateRecipe = async (req, res) => {
    const { title, ingredients, instructions } = req.body;
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        if (recipe.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        recipe.title = title;
        recipe.ingredients = ingredients;
        recipe.instructions = instructions;

        if (req.file) {
            const oldImagePath = path.join(__dirname, '../uploads', recipe.image);
            deleteFile(oldImagePath);
            recipe.image = req.file.filename;
        }

        const updatedRecipe = await recipe.save();
        res.json(updatedRecipe);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};




const deleteRecipe = async (req, res) => {
    console.log('Request to delete recipe with id:', req.params.id);
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            console.log('Recipe not found');
            return res.status(404).json({ message: 'Recipe not found' });
        }
        console.log('Recipe found:', recipe);

        // Usuń plik obrazu, jeśli istnieje
        if (recipe.image) {
            fs.unlinkSync(path.join(__dirname, '../uploads', recipe.image));
        }

        await Recipe.deleteOne({ _id: req.params.id });
        console.log('Recipe removed');
        res.json({ message: 'Recipe removed' });
    } catch (error) {
        console.error('Error deleting recipe:', error);
        res.status(500).json({ message: error.message });
    }
};

const addComment = async (req, res) => {
    const { text } = req.body;
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            console.log('Recipe not found');
            return res.status(404).json({ message: 'Recipe not found' });
        }
        const comment = {
            text,
            user: req.user._id,
            username: req.user.username, // Upewnij się, że username jest ustawiony
        };
        console.log('Adding comment:', comment);
        recipe.comments.push(comment);
        await recipe.save();
        console.log('Comment added successfully');
        res.status(201).json(comment);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(400).json({ message: error.message });
    }
};




const getMyRecipes = async (req, res) => {
    try {
        console.log('Fetching recipes for user:', req.user._id); // Log ID użytkownika
        const recipes = await Recipe.find({ user: req.user._id }).populate('user', 'username');
        console.log('Fetched recipes:', recipes); // Log fetched recipes
        res.json(recipes);
    } catch (error) {
        console.error('Error fetching user recipes:', error); // Log błędu
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe, addComment, getMyRecipes };


module.exports = { getRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe, addComment, getMyRecipes };
