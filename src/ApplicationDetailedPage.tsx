import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './redux/store';
import { setUsername } from './redux/authSlice';
import Breadcrumbs from './components/Breadcrumbs/Breadcrumbs';
import './CalculationDetail.css';
import logoImage from './logo.png';
import Header from './Header'; 

interface Calculation {
  calculation_id: number;
  calculation_name: string;
  calculation_description: string;
  calculation_image_url: string;
  full_url: string;
  result: number;
}

interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  login: string;
  role: string;
}

interface Application {
  user: User;
  application_status: string;
  moderator: User;
  input_first_param: number;
  input_second_param: number;
}

interface ApplicationCalc {
    application: Application;
    calculation: { calculation: Calculation;}[];
  }

function translateStatus(status: string): string {
    switch (status) {
      case 'Deleted':
        return 'Удалено';
      case 'Finished':
        return 'Завершено';
      case 'In service':
        return 'Сформировано';
      case 'Inserted':
        return 'Введено';
      case 'Cancelled':
        return 'Отклонено';
      default:
        return 'Неизвестно';
    }
  }

const ApplicationDetailPage: React.FC = () => {
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const [orderData, setOrderData] = useState<ApplicationCalc | null>(null);
  const navigateTo = useNavigate();
  const isUserLoggedIn = document.cookie.includes('session_key');
  const username = useSelector((state: RootState) => state.auth.username);

  const [editedClientInfo, setEditedClientInfo] = useState({
    input_first_param: orderData?.application.input_first_param || '',
    input_second_param: orderData?.application.input_second_param || '',
  });

  const breadcrumbsItems = [
    { label: 'Все операции', link: '/operations/' },
    { label: 'Подробнее', link: '' }
  ];

  const handleLogoutClick = () => {
    navigateTo('/operations/');
  };

    const fetchOrderData = async () => {
        try {
            const orderResponse = await axios.get(`http://localhost:8000/api/applications/${id}/`, {
              withCredentials: true,
            });
          
            const orderData = orderResponse.data;
            setOrderData(orderData);
            console.log(orderData)
            setEditedClientInfo({
              input_first_param: orderData.application.input_first_param,
              input_second_param: orderData.application.input_second_param,
            });
          } catch (error) {
            console.error('Error fetching order data:', error);
          }
      };
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user_name = localStorage.getItem('username');
        dispatch(setUsername(user_name || ''));
        } catch (error) {
        }
      };
    
      if (isUserLoggedIn) {
        fetchUserData();
      }
  }, [isUserLoggedIn, dispatch]);

  useEffect(() => {

    fetchOrderData();

    return () => {
    };
  }, [id]);


  
  const handleSaveChanges = async () => {
    try {
        await axios.put(`http://localhost:8000/api/applications/${id}/change_inputs/`, {
          input_first_param: editedClientInfo.input_first_param,
          input_second_param: editedClientInfo.input_second_param,
        }, {
          withCredentials: true,
        });
      
        fetchOrderData();
      } catch (error) {
        console.error('Error updating client information:', error);
      }
      
  };

  const handleConfirmOrder = async () => {
    try {
      await axios.put(`http://localhost:8000/api/applications/${id}/change_status/client/`, {
        application_status: 'In service',
      }, {
        withCredentials: true,
      });
    
      fetchOrderData();
    } catch (error) {
      console.error('Error updating client information:', error);
    }
    };

    const handleDeleteOrder = async () => {
        try {
            await axios.delete(`http://localhost:8000/api/applications/${id}/delete/`, {
              withCredentials: true,
            });
          
            fetchOrderData();
            navigateTo('/operations/')
          } catch (error) {
            console.error('Error deleting application:', error);
          }
        };

  const handleDeleteCalculation = async (calculationId: number) => {
    try {
      await axios.delete(`http://localhost:8000/api/applications_calculations/${id}/operations_delete/${calculationId}/`,
      {
        withCredentials: true,
      });
      fetchOrderData()
    } catch (error) {
      console.error('Ошибка при удалении операции:', error);
    }
  };

  return (
    <div>
      <Header
          isUserLoggedIn={isUserLoggedIn}
          operations_link={'/operations/'}
          username={username}
          handleLogoutClick={handleLogoutClick}
        />
      <div className="container">
        <div className="row">
        <div className="header-container">
          <Breadcrumbs items={breadcrumbsItems} />
          </div>  
          <div className="col">
            {orderData && (
              <div className="order-details">
                {orderData.application.application_status !== 'Inserted' ? (
                  <>
                    <h2>Информация о заявке</h2>
                    <div className="status-info">
                      <p>
                        <b>Статус заявки:</b> {translateStatus(orderData.application.application_status) || 'Не указан'}
                      </p>
                    </div>
                    <div className="client-info">
                      <p>
                        <b>Первый параметр:</b> {orderData.application.input_first_param || 'Не указано'} | 
                        <b>  Второй параметр:</b> {orderData.application.input_second_param || 'Не указано'} | 
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <h2>Редактирование информации о заявке</h2>
                    <div className="client-info">
                      <label>
                        Первый параметр:
                        <input
                          type="text"
                          value={editedClientInfo.input_first_param}
                          onChange={(e) => setEditedClientInfo({ ...editedClientInfo, input_first_param: e.target.value })}
                        />
                      </label>
                      <label>
                        Второй параметр:
                        <input
                          type="text"
                          value={editedClientInfo.input_second_param}
                          onChange={(e) => setEditedClientInfo({ ...editedClientInfo, input_second_param: e.target.value })}
                        />
                      </label>
                      <button onClick={handleSaveChanges}>Сохранить изменения</button>
                      <button onClick={handleConfirmOrder}>Подтвердить заявку</button>
                      <button onClick={handleDeleteOrder}>Удалить заявку</button>
                    </div>
                  </>
                )}
                <h3>Информация о вычислительных операциях</h3>
                {orderData.calculation.map((detail, index) => (
                <div key={index} className="card">
                    <img
                    src={(detail.full_url !== '' && detail.full_url !== 'http://localhost:9000/pictures/None') ? detail.full_url : logoImage}
                    alt={detail.full_url}
                    className="card-img-top"
                    />
                    <div className="card-body">
                    <h5 className="card-title">{detail.calculation_name}</h5>
                    <p className="card-text">Название операции: {detail.calculation_name}</p>
                    <p className="card-text">Описание: {detail.calculation_description || 'Информация уточняется'}</p>
                    <p className="card-text">Результат вычисления: {detail.result === -1 ? 'Ошибка расчёта' : detail.result || ''}</p>

                    {orderData.application.application_status === 'Inserted' && (
                        <div>
                        <button onClick={() => handleDeleteCalculation(detail.calculation_id)}>
                            <span role="img" aria-label="Delete">❌</span> Удалить операцию
                        </button>
                        </div>
                    )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailPage;