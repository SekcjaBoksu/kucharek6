import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RecipeList = () => {
    const [recipes, setRecipes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recipesPerPage] = useState(12);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('');

    useEffect(() => {
        const fetchRecipes = async () => {
            const { data } = await axios.get('/api/recipes', {
                params: {
                    search: searchTerm,
                    sort: sortOption
                }
            });
            setRecipes(data);
        };

        fetchRecipes();
    }, [searchTerm, sortOption]);

    const indexOfLastRecipe = currentPage * recipesPerPage;
    const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
    const currentRecipes = recipes.slice(indexOfFirstRecipe, indexOfLastRecipe);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <h1>Przepisy</h1>
            <input
                type="text"
                placeholder="Szukaj po nazwie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select onChange={(e) => setSortOption(e.target.value)}>
                <option value="">Sortuj według</option>
                <option value="oldest">Najstarsze</option>
                <option value="a-z">A-Z</option>
                <option value="z-a">Z-A</option>
                <option value="newest">Najnowsze</option>
            </select>
            <div className="recipe-grid">
                {currentRecipes.map(recipe => (
                    <div key={recipe._id} className="recipe-card">
                        <h2>{recipe.title}</h2>
                        {recipe.image && (
                            <img src={`/uploads/${recipe.image}`} alt={recipe.title} />
                        )}
                        <p>Added by: {recipe.username}</p>
                        <Link to={`/recipes/${recipe._id}`} className="small-link">See details</Link>
                        <Link to={`/recipes/${recipe._id}/edit`} className="small-link">Edit</Link>
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

export default RecipeList;
