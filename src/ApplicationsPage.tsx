import React, { FC, useState, useEffect } from 'react';
import './ApplicationsPage.css'
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import Header from './Header'; 
import { RootState } from './redux/store';
import { setUsername } from './redux/authSlice';
import Breadcrumbs from './components/Breadcrumbs/Breadcrumbs';


const formatDate = (dateString: string) => {
    if (!dateString) {
        return ''; // Return an empty string if the date string is empty
    }

    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
  
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru', options).format(date);
  };

  interface Application {
    application_id: number;
    moderator_login: string | null;
    user_login: string | null;
    date_application_create: string;
    date_application_accept: string;
    date_application_complete: string;
    input_first_param: number;
    input_second_param: number;
    application_status: string;
    count_empty_results: number;
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



const ApplicationsPage: FC = () => {
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);
  const statusParam = queryParams.get('status') || '';
  const startParam = queryParams.get('start_date') || '';
  const endParam = queryParams.get('end_date') || '';
  const isUserLoggedIn = document.cookie.includes('session_key');
  const username = useSelector((state: RootState) => state.auth.username);

  const [statusValue, setStatusValue] = useState(statusParam);
  const [startValue, setStartValue] = useState(startParam);
  const [endValue, setEndValue] = useState(endParam);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const handleLoginClick = () => {
    navigateTo('/login/');
  };

  const breadcrumbsItems = [
    { label: 'Все операции', link: '/operations' },
    { label: 'Заявки', link: '' } 
  ];

  const [searchValue, setSearchValue] = useState('');

  const handleSearchClick = () => {
    /*navigateTo(`http://localhost:8000/api/applications/?status=${statusValue}&start_date=${startValue}&end_date=${endValue}`);*/
    fetchApplications(statusValue, startValue, endValue);
  };

  const handleAccept = async (applicationId: number) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/applications/${applicationId}/change_status/moderator/`,
        { application_status: 'Finished' },
        { withCredentials: true }
      );
    
      console.log('Application finished successfully:', response.data);
    
      fetchApplications(statusValue, startValue, endValue);
    } catch (error) {
      console.error('Error while finishing application:', error);
    }
    
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user-data');
        const userData = await response.json();
      } catch (error) {
      }
    };

    if (isUserLoggedIn) {
      fetchUserData();
    }
  }, [isUserLoggedIn, dispatch]);

  const handleReject = async (applicationId: number) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/applications/${applicationId}/change_status/moderator/`,
        { application_status: 'Cancelled' },
        { withCredentials: true } 
      );
    
      console.log('Application rejected successfully:', response.data);
    
      fetchApplications(statusValue, startValue, endValue);
    } catch (error) {
      console.error('Error rejecting application:', error);
    }
    
  };

  const handleLogoutClick = () => {
    navigateTo('/operations/');
  };


  const navigateTo = useNavigate();

  const [applications, setApplications] = useState<Application[]>([]);

  const fetchApplications = async (statusValue:string, startValue:string, endValue:string) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/applications/?status=${statusValue}&start_date=${startValue}&end_date=${endValue}`, { withCredentials: true });
      const data = response.data;
    
      const filteredApplications = data.filter(application =>
        application.user_login?.toLowerCase().includes(searchValue.toLowerCase())
      );
    
      setApplications(filteredApplications);
    } catch (error) {
      console.error('Error fetching applications:', error);
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
    fetchApplications(statusValue, startValue, endValue);
  }, [statusValue, startValue, endValue, searchValue]);
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchApplications(statusValue, startValue, endValue);
    }, 2000);

    return () => clearInterval(intervalId);
  }, [statusValue, startValue, endValue, searchValue]);

  return (
    <div>
      <Header
          isUserLoggedIn={isUserLoggedIn}
          operations_link={'/operations/'}
          username={username}
          handleLoginClick={handleLoginClick}
          handleLogoutClick={handleLogoutClick}
        />

      <div className="header-container"  style={{ marginTop: '45px', marginLeft: '40px' }}>
        <Breadcrumbs items={breadcrumbsItems} />
      </div> 
        <div className="album">
        <div className="container">
          <div className="row">
            <table className="table" style={{ marginTop: 'Xpx' }}>
              <thead>
                <tr>
                  <th scope="col">Дата, время создания</th>
                  <th scope="col">Дата, время расчёта</th>
                  <th scope="col">Дата, время завершения</th>
                  <th scope="col">Первый параметр</th>
                  <th scope="col">Второй параметр</th>
                  <th scope="col">Статус</th>
                  <th scope="col">Кол-во результатов</th>
                  <th scope="col">Действия</th>
                </tr>
              </thead>

              <tbody>
                {applications.map((application, index) => (
                  <React.Fragment key={application.application_id}>
                    <tr 
                    className={`table-row ${index === hoveredRow ? 'hovered' : ''}`}
                    onMouseOver={() => setHoveredRow(index)}
                    onMouseLeave={() => setHoveredRow(null)}
                    >
                      <td style={{ padding: '8px' }}>{formatDate(application.date_application_create)}</td>
                      <td style={{ padding: '8px' }}>{formatDate(application.date_application_accept)}</td>
                      <td style={{ padding: '8px' }}>{formatDate(application.date_application_complete)}</td>
                      <td style={{ padding: '8px' }}>{application.input_first_param.toFixed(2)}</td>
                      <td style={{ padding: '8px' }}>{application.input_second_param.toFixed(2)}</td>
                      <td style={{ padding: '8px' }}>{translateStatus(application.application_status)}</td>
                      <td style={{ padding: '8px' }}>{application.count_empty_results}</td>


                        <>
                        <td style={{ padding: '8px' }}>
                        <div className="text-and-button">
                      <span
                        className="basket-text" 
                        onClick={() => {
                        navigateTo(`/applications/${application.application_id}/`);
              }}
            >
            <p>Подробнее</p>
            </span>
          </div>
                          </td>
                        </>
                    </tr>
                    {index !== applications.length - 1 && <tr className="table-divider"></tr>}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsPage;