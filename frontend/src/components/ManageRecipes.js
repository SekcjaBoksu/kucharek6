import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ManageRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recipesPerPage] = useState(12);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchRecipes = async () => {
            const { data } = await axios.get('/api/recipes');
            setRecipes(data);
        };

        const checkAdmin = () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    setIsAdmin(decodedToken.isAdmin);
                } catch (error) {
                    console.error('Failed to decode token', error);
                }
            }
        };

        fetchRecipes();
        checkAdmin();
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
            <h1>Zarządzaj przepisami</h1>
            <div className="recipe-grid">
                {currentRecipes.map(recipe => (
                    <div key={recipe._id} className="recipe-card">
                        <h2>{recipe.title}</h2>
                        {recipe.image && (
                            <img src={`/uploads/${recipe.image}`} alt={recipe.title} />
                        )}
                        <p>Autor: {recipe.username}</p>
                        <Link to={`/recipes/${recipe._id}`}className="small-link">Rozwiń</Link>
                        <Link to={`/recipes/${recipe._id}/edit`}className="small-link">Edytuj</Link> {/* Przyciski edycji */}
                        {isAdmin && (
                            <button className="delete" onClick={() => deleteRecipe(recipe._id)}>Usuń</button>
                        )}
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

export default ManageRecipes;
