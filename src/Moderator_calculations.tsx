import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Breadcrumbs from './components/Breadcrumbs/Breadcrumbs';
import './Calculation.css';
import logoImage from './logo.png';
import Header from './Header'; 
import { RootState } from './redux/store';
import { setUserrole, setUsername } from './redux/authSlice';
import axios from 'axios';

interface Calculation {
  calculation_id: number;
  calculation_name: string;
  calculation_description: string;
  full_url: string;
  calculation_status: string;
}

const ModeratorCalculationsPage: FC = () => {
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const [calculations, setCalculations] = useState<Calculation[]>([]);

  const isUserLoggedIn = document.cookie.includes('session_key');
  const username = useSelector((state: RootState) => state.auth.username);
  const role = useSelector((state: RootState) => state.auth.userrole);
  const operationsLink = role === 'Moderator' ? '/moderator/operations/' : '/operations';

  const handleLoginClick = () => {
    navigateTo('/login/');
  };

  const handleLogoutClick = () => {
    fetchCalculations();
  };

  const breadcrumbsItems = [
    { label: 'Все операции', link:'' }
  ];

  const handleDelete = async (calculationId: number) => {
    try {
      await axios(`http://localhost:8000/api/operations/${calculationId}/delete/`,
      {
        method: 'DELETE',
        withCredentials: true
      });
      fetchCalculations();
    } catch (error) {
      console.error('Error deleting calculation:', error);
    }
  };

  const handleRestore = async (calculationId: number) => {
    try {
      await axios.put(`http://localhost:8000/api/operations/${calculationId}/edit/`, {
        calculation_status: 'Active'
      }, {
        withCredentials: true,
      });
      fetchCalculations();
    } catch (error) {
      console.error('Error restoring calculation:', error);
    }
    
  };

  const fetchCalculations = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/operations/?status=all`, {
        withCredentials: true,
      });
      const data = response.data;
      setCalculations(data.calculations);
    } catch (error) {
      console.error('Error fetching calculations:', error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user_name = localStorage.getItem('username');
        dispatch(setUsername(user_name || ''));
        const user_role = localStorage.getItem('userrole');
        dispatch(setUserrole(user_role || ''));
        } catch (error) {
        }
      };
    
      if (isUserLoggedIn) {
        fetchUserData();
      }
  }, [isUserLoggedIn, dispatch]);

  useEffect(() => {
    fetchCalculations();
  }, []);


  return (
    <div>
      <Header
          isUserLoggedIn={isUserLoggedIn}
          operations_link={operationsLink}
          username={username}
          handleLoginClick={handleLoginClick}
          handleLogoutClick={handleLogoutClick}
        />

      <div className="album">
        <div className="container">
          <div className="row">
          <div className="header-container">
          <Breadcrumbs items={breadcrumbsItems} />
          </div>  
            <table className="table" style={{ marginTop: '10px' }}>
              <thead>
                <tr>
                  <th scope="col">Картинка</th>
                  <th scope="col">Имя</th>
                  <th scope="col">Статус</th>
                  <th scope="col">Действия</th>
                </tr>
              </thead>
              <tbody>
                {calculations.map((calculation) => (
                  <tr key={calculation.calculation_id}>
                    <td style={{  padding: '8px' }}>
                      <img
                        src={
                          calculation.full_url !== '' && calculation.full_url !== 'http://localhost:9000/pictures/None'
                            ? calculation.full_url
                            : logoImage
                        }
                        alt={calculation.calculation_name}
                        style={{ width: '100px', height: '100px' }}
                      />
                    </td>
                    <td style={{  padding: '8px' }}>{calculation.calculation_name}</td>
                    <td style={{ padding: '8px' }}>
                      {calculation.calculation_status === 'Active' ? 'Доступно' : 'Удалёно'}
                    </td>
                    <td style={{ padding: '8px' }}>
                      {calculation.calculation_status === 'Active' ? (
                          <button onClick={() => handleDelete(calculation.calculation_id)} className="btn btn-primary">
                            Удалить
                          </button>
                      ) : (
                        <button onClick={() => handleRestore(calculation.calculation_id)} className="btn btn-primary">
                          Активировать
                        </button>
                      )}
                     {calculation.calculation_status === 'Active' && (
                        <a href={`/moderator/operations/change/${calculation.calculation_id}/`} className="btn btn-primary">
                          Редактировать
                        </a>
                      )}
                      {calculation.calculation_status !== 'Active' && (
                        <a className="btn btn-second" style={{ backgroundColor: 'gray' }}>
                          Редактировать
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-and-button">
            <button className="btn btn-add" onClick={() => navigateTo('/moderator/operations/new/')}>
              Добавить вычислительную операцию
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeratorCalculationsPage