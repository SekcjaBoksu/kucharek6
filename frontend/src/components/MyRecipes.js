import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

const MyRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recipesPerPage] = useState(12);

    useEffect(() => {
        const fetchMyRecipes = async () => {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };
            const { data } = await axios.get('/api/recipes/myrecipes', config);
            setRecipes(data);
        };

        fetchMyRecipes();
    }, []);

    const deleteRecipe = async (id) => {
        console.log('Deleting recipe with id:', id);
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };
            const response = await axios.delete(`/api/recipes/${id}`, config);
            console.log('Response from server:', response);
            if (response.status === 200) {
                setRecipes(recipes.filter(recipe => recipe._id !== id));
            } else {
                console.error('Failed to delete recipe:', response.data.message);
            }
        } catch (error) {
            console.error('Error deleting recipe', error);
        }
    };

    // Get current recipes
    const indexOfLastRecipe = currentPage * recipesPerPage;
    const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
    const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <h1>Moje Przepisy</h1>
            <div className="recipe-grid">
                {currentRecipes.map(recipe => (
                    <div key={recipe._id} className="recipe-card">
                        <h2>{recipe.title}</h2>
                        {recipe.image && (
                            <img src={`/uploads/${recipe.image}`} alt={recipe.title} />
                        )}
                        <p>Autor: {recipe.username}</p>
                        <Link to={`/recipes/${recipe._id}`} className="small-link">Rozwiń</Link>
                        <Link to={`/recipes/${recipe._id}/edit`} className="small-link">Edytuj</Link> {/* Przyciski edycji */}
                        <button className="delete" onClick={() => deleteRecipe(recipe._id)}>Usuń</button>
                    </div>
                ))}
            </div>
            <div className="pagination">
                {[...Array(Math.ceil(recipes.length / recipesPerPage)).keys()].map(number => (
                    <button key={number + 1} onClick={() => paginate(number + 1)}>
                        {number + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MyRecipes;
