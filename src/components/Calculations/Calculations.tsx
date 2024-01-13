import { FC, useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import './Calculations.css';
import logoImage from '../../logo.png';
import { RootState } from '../../redux/store';
import Header from '../../Header'; 
import { setUsername } from '../../redux/authSlice';
import { setSearchValue } from '../../redux/calcSlice';
import full_basket from '../../full_basket.png'
import empty_basket from '../../empty_basket.png'
import axios from 'axios';


interface Calculation {
  calculation_id: number;
  calculation_name: string;
  calculation_description: string;
  full_url: string;
}


const CalculationsPage: FC = () => {
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [headerMessage, setHeaderMessage] = useState<string>('');
  const [headerId, setHeaderId] = useState<string>('');

  const isUserLoggedIn = document.cookie.includes('session_key');
  const username = useSelector((state: RootState) => state.auth.username);
  const searchValue = useSelector((state: RootState) => state.calc.searchValue);

  const handleLoginClick = () => {
    navigateTo('/login/');
  };

  const handleLogoutClick = () => {
    fetchCalculations(searchValue);
  };

  const handleSearchClick = () => {
    dispatch(setSearchValue(searchValue));
    fetchCalculations(searchValue);
  };
  

  const handleAddToCart = async (calculationId: number) => {
    try {
      await axios(`http://localhost:8000/api/operations/${calculationId}/add/`, {
        method: 'POST',
        withCredentials: true
      })
      fetchCalculations(searchValue);
    } catch (error) {
    }
  };

  const fetchCalculations = (searchText: string) => {
    // Fetch bouquet data using the relative path with query parameter
    axios.get(`http://localhost:8000/api/operations/`, {
      params: { title: searchText },
      withCredentials: true, 
    })
      .then(response => {
        const calculationsData = response.data.calculations || [];
        console.log('Calculations fetched:', calculationsData);
        setCalculations(calculationsData);
        const insertedApplicationId = response.data.inserted_application_id;
        console.log(insertedApplicationId);
        const newHeaderMessage = insertedApplicationId === null ? 'null' : 'не null';
        const newHeaderId = insertedApplicationId === null ? 0 : insertedApplicationId;
        setHeaderMessage(newHeaderMessage);
        setHeaderId(newHeaderId);
      })
      .catch(error => {
        console.error('Error fetching calculations:', error);
      });
  };

  const breadcrumbsItems = [
    { label: 'Все операции', link:'' }
  ];

  useEffect(() => {
    fetchCalculations(searchValue);
  }, []);

  useEffect(() => {
    // Fetch user data when the component mounts
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
          operations_link={'/operations/'}
          username={username}
          handleLoginClick={handleLoginClick}
          handleLogoutClick={handleLogoutClick}
        />

    <div className="album">
      <div className="container">
        <div className="row">
          <div className="header-container">
            <Breadcrumbs items={breadcrumbsItems} /> 
            <div className="basket-container">
                <img
                  src={headerMessage === 'null' ? empty_basket : full_basket}
                  alt="Basket Image"
                  className="basket-image"
                  onClick={() => {
                    if (headerMessage !== 'null') {
                      navigateTo(`/applications/${headerId}/`);
                    }
                  }}
                />
            </div>
          </div>  
            <div className="search-bar">
              <input
                type="text"
                id="search-input"
                placeholder="Поиск"
                value={searchValue}
                onChange={(event) => dispatch(setSearchValue(event.target.value))}
              />
              <button type="button" id="search-button" onClick={handleSearchClick}>
                Искать
              </button>
            </div>

          {calculations.map((calculation) => (
            <div className="col" key={calculation.calculation_id}>
              <div className="card">
                <img
                  src={
                    calculation.full_url !== '' && calculation.full_url !== 'http://localhost:9000/images/images/None'
                      ? calculation.full_url
                      : logoImage
                  } // Use bouquet.full_url or default logoImage
                  alt={calculation.calculation_name}
                  className="card-img-top"
                />
                <div className="card-body">
                  <h5 className="card-title">{calculation.calculation_name}</h5>
                  <p className="card-text">{calculation.calculation_description}</p>
                  <a
                      className="btn btn-primary"
                      onClick={(e) => {
                        e.preventDefault(); // Prevent page refresh
                        navigateTo(`/operations/${calculation.calculation_id}/`);
                      }}
                    >
                      Подробнее
                    </a>

                  <button onClick={() => handleAddToCart(calculation.calculation_id)} className="btn btn-primary">
                    В корзину
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
  );
};

export default CalculationsPage;