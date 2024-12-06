import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

const EditRecipe = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const [title, setTitle] = useState('');
    const [ingredients, setIngredients] = useState([]);
    const [ingredientInput, setIngredientInput] = useState('');
    const [instructions, setInstructions] = useState('');
    const [image, setImage] = useState(null);
    const [currentImage, setCurrentImage] = useState('');

    useEffect(() => {
        const fetchRecipe = async () => {
            const { data } = await axios.get(`/api/recipes/${id}`);
            setTitle(data.title);
            setIngredients(data.ingredients.split(','));
            setInstructions(data.instructions);
            setCurrentImage(data.image);
        };

        fetchRecipe();
    }, [id]);

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
            await axios.put(`/api/recipes/${id}`, formData, config);
            navigate(`/recipes/${id}`);
        } catch (error) {
            console.error('Error updating recipe', error);
        }
    };

    if (!user) {
        return <div>Proszę się zalogować, aby edytować przepis.</div>;
    }

    return (
        <div className="container">
            <h1>Edytuj Przepis</h1>
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
                        placeholder="Dodaj składnik i naciśnij Enter"
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
                    <label htmlFor="instructions">Instrukcje</label>
                    <textarea
                        id="instructions"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        required
                        className="instructions-textarea"
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="image">Zdjęcie</label>
                    {currentImage && <img src={`/uploads/${currentImage}`} alt="Current" style={{ width: '200px', height: 'auto' }} />}
                    <input
                        type="file"
                        id="image"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>
                <button type="submit">Zaktualizuj Przepis</button>
            </form>
        </div>
    );
};

export default EditRecipe;
