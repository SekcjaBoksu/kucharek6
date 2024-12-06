// backend/routes/index.js
const express = require('express');
const { getRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe, addComment } = require('../controllers/recipeController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(getRecipes).post(protect, createRecipe);
router.route('/:id').get(getRecipeById).put(protect, updateRecipe).delete(protect, deleteRecipe);
router.route('/:id/comments').post(protect, addComment);

module.exports = router;
