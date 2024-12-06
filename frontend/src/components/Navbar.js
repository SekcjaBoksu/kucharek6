import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useContext(UserContext);

    const handleLogout = () => {
        logout();
        navigate('/');
        alert('Successfully logged out');
    };

    return (
        <nav className="navbar">
            <h1>{user ? `Witaj, użytkowniku!` : 'Witaj, gościu!'}</h1>
            <div className="links">
                <Link to="/">Strona Główna</Link>
                {!user && <Link to="/login">Logowanie</Link>}
                {!user && <Link to="/register">Rejestracja</Link>}
                {user && <Link to="/add-recipe">Dodaj Przepis</Link>}
                {user && <Link to="/my-recipes">Moje Przepisy</Link>}
                {user && user.isAdmin && <Link to="/manage-recipes">Zarządzaj przepisami</Link>}
                {user && <button onClick={handleLogout}>Wyloguj</button>}
            </div>
        </nav>
    );
};

export default Navbar;
