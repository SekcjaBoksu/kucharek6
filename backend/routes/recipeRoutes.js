const express = require('express');
const router = express.Router();
const { getRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe, addComment, getMyRecipes } = require('../controllers/recipeController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(getRecipes)
    .post(protect, upload.single('image'), createRecipe);

router.route('/myrecipes')
    .get(protect, getMyRecipes);

router.route('/:id')
    .get(getRecipeById)
    .put(protect, upload.single('image'), updateRecipe)
    .delete(protect, deleteRecipe);

router.route('/:id/comments')
    .post(protect, addComment);

module.exports = router;
