import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import './CalculationsDetailed.css';
import logoImage from '../../logo.png';
import Header from '../../Header'; 
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { setUsername } from '../../redux/authSlice';

const CalculationsDetailedPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); 
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const isUserLoggedIn = document.cookie.includes('session_key');
  const username = useSelector((state: RootState) => state.auth.username);
  const [calculationData, setCalculationtData] = useState({
    calculation_name: '',
    calculation_description: '',
    full_url: ''
  });

  const handleLogoutClick = () => {
    navigateTo('/operations/');
  };

  const breadcrumbsItems = [
    { label: 'Все операции', link: '/operations' },
    { label: 'Подробнее', link: '' } 
  ];


  useEffect(() => {
    const fetchCalculationData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/operations/${id}/`); 
        const data = await response.json();
        setCalculationtData(data); 
      } catch (error) {
        console.error('Error fetching calculation data:', error);
      }
    };

    fetchCalculationData(); 

    return () => {
    };
  }, [id]); // при изменении 'id'

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = localStorage.getItem('username');
        dispatch(setUsername(user || ''));
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (isUserLoggedIn) {
      fetchUserData();
    }
  }, [isUserLoggedIn, dispatch]);

  return (
    <div>
    <Header
          isUserLoggedIn={isUserLoggedIn}
          username={username}
          handleLogoutClick={handleLogoutClick}
        />
    <div className="container">
      {
        <div className="row">
          <Breadcrumbs items={breadcrumbsItems} /> 
          <div className="col">
            <div className="card">

            <img
                  src={(calculationData.full_url != '' && calculationData.full_url != 'http://localhost:9000/pictures/None') ? calculationData.full_url : logoImage} 
                  alt={calculationData.full_url}
                  className="card-img-top"
                />
              <div className="card-body">
                <h5 className="card-title">{calculationData.calculation_name}</h5>
                <p className="card-text">{calculationData.calculation_description}</p>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
    </div>
  );
};

export default CalculationsDetailedPage;