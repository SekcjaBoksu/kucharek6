import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { UserContext } from '../UserContext';

const RecipeDetail = () => {
    const { id } = useParams();
    const { user } = useContext(UserContext);
    const [recipe, setRecipe] = useState(null);
    const [commentText, setCommentText] = useState('');

    useEffect(() => {
        const fetchRecipe = async () => {
            const { data } = await axios.get(`/api/recipes/${id}`);
            setRecipe(data);
        };

        fetchRecipe();
    }, [id]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        try {
            const { data } = await axios.post(`/api/recipes/${id}/comments`, { text: commentText }, config);
            setRecipe({ ...recipe, comments: [...recipe.comments, data] });
            setCommentText('');
        } catch (error) {
            console.error('Error adding comment', error);
        }
    };

    if (!recipe) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <h2>{recipe.title}</h2>
            {recipe.image && (
                <img src={`/uploads/${recipe.image}`} alt={recipe.title} style={{ width: '500px', height: 'auto' }} />
            )}
            <ul className="recipe-ingredients">
                {recipe.ingredients.split(',').map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                ))}
            </ul>
            <p>{recipe.instructions}</p>
            <p>Autor: {recipe.username}</p>
            {user && user._id === recipe.user && (
                <Link to={`/recipes/${id}/edit`}>Edytuj Przepis</Link>
            )}
            <h3>Komentarze</h3>
            <ul className="comment-list">
                {recipe.comments.map((comment, index) => (
                    <li key={index}>
                        <strong>{comment.username}:</strong> {comment.text}
                    </li>
                ))}
            </ul>
            {user && (
                <form onSubmit={handleAddComment}>
                    <textarea 
                        value={commentText} 
                        onChange={(e) => setCommentText(e.target.value)} 
                        placeholder="Napisz komentarz..." 
                        required 
                    />
                    <button type="submit">Dodaj Komentarz</button>
                </form>
            )}
        </div>
    );
};

export default RecipeDetail;
