import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from './redux/authSlice';

interface LogoutButtonProps {
  onLogout: () => void; // Define a callback function type
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Вызываем clearAuthToken, чтобы удалить токен из Redux и кук
    dispatch(logoutUser());

    setTimeout(() => {
      navigate('/operations');
      onLogout();

    }, 70); // 70 milliseconds (0.1 seconds) timeout
  };

  return (
    <button className="btn btn-primary" onClick={handleLogout}>
      Выйти
    </button>
  );
};

export default LogoutButton;