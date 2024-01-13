import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate} from 'react-router-dom';
import LogoutButton from './LogoutButton';
import { setUsername } from './redux/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './redux/store';
import logoImage from './logo.png';

interface HeaderProps {
  isUserLoggedIn: boolean;
  operations_link: string;
  username: string;
  handleLoginClick: () => void;
  handleLogoutClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ isUserLoggedIn, operations_link, username, handleLoginClick, handleLogoutClick }) => {
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  return (
    <header>
    <div className='info-container'>
        <Link to="/operations">
            <img src={logoImage} alt="Логотип" className="logo" />
        </Link>
        <h1>Удалённые вычисления</h1>
    </div>
        <div className='greatest-container'>
            <div className="text-and-button">
            <span
                className="basket-text"
                onClick={() => {
                navigateTo(operations_link);
                }}
            >
                <p>Все  вычислительные операции</p>
            </span>
            </div>
            {!isUserLoggedIn && (
            <div className="text-and-button">
                <button className="btn btn-primary" onClick={handleLoginClick}>
                Войти
                </button>
            </div>
            )}
            {isUserLoggedIn && (
            <div className="text-and-button">
                <span
                className="basket-text"
                onClick={() => {
                    navigateTo('/applications/');
                }}
                >
                <p>Заявки</p>
                </span>
                <p>{username}</p>
                <LogoutButton onLogout={handleLogoutClick} />
            </div>
            )}
        </div>
    </header>
  );
};

export default Header;
