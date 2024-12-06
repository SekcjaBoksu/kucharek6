import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RecipeList from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import AddRecipe from './components/AddRecipe';
import ManageRecipes from './components/ManageRecipes';
import MyRecipes from './components/MyRecipes';
import EditRecipe from './components/EditRecipe'; // Import nowego komponentu
import { UserProvider } from './UserContext';
import './App.css';
import logo from './logo.png';

const App = () => {
    return (
        <UserProvider>
            <Router>
                <div className="container">
                    <div className="logo-container">
                        <img src={logo} alt="Logo" className="logo" />
                    </div>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<RecipeList />} />
                        <Route path="/recipes/:id" element={<RecipeDetail />} />
                        <Route path="/recipes/:id/edit" element={<EditRecipe />} /> {/* Nowa trasa */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/add-recipe" element={<AddRecipe />} />
                        <Route path="/manage-recipes" element={<ManageRecipes />} />
                        <Route path="/my-recipes" element={<MyRecipes />} />
                    </Routes>
                </div>
            </Router>
        </UserProvider>
    );
};

export default App;
