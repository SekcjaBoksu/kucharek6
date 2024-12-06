import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddRecipe = () => {
    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const [ingredientInput, setIngredientInput] = useState('');
    const [instructions, setInstructions] = useState('');
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    const handleAddIngredient = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (ingredientInput.trim() !== '') {
                setIngredients([...ingredients, ingredientInput.trim()]);
                setIngredientInput('');
            }
        }
    };

    const handleRemoveIngredient = (index) => {
        setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('ingredients', ingredients.join(','));
        formData.append('instructions', instructions);
        if (image) {
            formData.append('image', image);
        }

        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        };

        try {
            await axios.post('/api/recipes', formData, config);
            navigate('/');
        } catch (error) {
            console.error('Error adding recipe', error);
        }
    };

    return (
        <div className="container">
            <h1>Podaj przepis</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Tytuł</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="ingredients">Składniki</label>
                    <input
                        type="text"
                        id="ingredients"
                        value={ingredientInput}
                        onChange={(e) => setIngredientInput(e.target.value)}
                        onKeyPress={handleAddIngredient}
                        placeholder="Aby dodać składnik wciśnij Enter..."
                    />
                    <ul className="ingredient-list">
                        {ingredients.map((ingredient, index) => (
                            <li
                                key={index}
                                className="ingredient-item"
                                onClick={() => handleRemoveIngredient(index)}
                            >
                                {ingredient}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <label htmlFor="instructions">Sposób przygotowania</label>
                    <textarea
                        id="instructions"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        required
                        className="instructions-textarea"
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="image">Zdjęcie  </label>
                    <input
                        type="file"
                        id="image"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>
                <div className="korekta"></div>
                <button type="submit">Dodaj Przepis</button>
            </form>
        </div>
    );
};

export default AddRecipe;
