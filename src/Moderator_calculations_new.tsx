import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Breadcrumbs from './components/Breadcrumbs/Breadcrumbs';
import './Moderator_calculations_change.css';
import logoImage from './logo.png';
import axios from 'axios';
import Header from './Header'; 
import { RootState } from './redux/store';
import { setUsername } from './redux/authSlice';


const ModeratorCalculationsNewPage: React.FC = () => {
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const isUserLoggedIn = document.cookie.includes('session_key');
  const username = useSelector((state: RootState) => state.auth.username);
  const navigateTo = useNavigate();
  const [calculationData, setCalculationData] = useState({
    calculation_name: '',
    calculation_description: '',
    full_url: '',
  });

  const breadcrumbsItems = [
    { label: 'Все операции', link: '/moderator/operations/' },
    { label: 'Создание новой операции', link: '' }
  ];

  const [editedData, setEditedData] = useState({
    calculation_name: '',
    calculation_description: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCalculationData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/operations/${id}/`);
        const data = await response.json();
        setCalculationData(data);
        setEditedData(data);
      } catch (error) {
        console.error('Error fetching calculation data:', error);
      }
    };

    fetchCalculationData();

    return () => {
    };
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleLogoutClick = () => {
    navigateTo('/moderator/operations/');
  };

  const openFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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

  const handleSaveChanges = async () => {
    try {
      // Загрузка фото
      const formData = new FormData();
      formData.append('key', 'photo');
      formData.append('photo', selectedFile as Blob);
    
      const uploadResponse = await axios.post('http://localhost:8000/api/operations/upload_photo/', formData, {
        withCredentials: true,
      });
    
      const updatedDataToSend = {
        ...editedData,
        calculation_image_url: uploadResponse.status === 200 ? uploadResponse.data.photo_url : 'base.png',  // Assuming the response includes the photo_url field
      };
    
      const response = await axios.post(`http://localhost:8000/api/operations/create/`, updatedDataToSend, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
    
      const updatedData = response.data;
      setCalculationData(updatedData);
      navigateTo('/moderator/operations/')
    } catch (error) {
      console.error('Ошибка обновления информации о вычислительной операции:', error);
    }
  };

  return (
    <div>
      <Header
          isUserLoggedIn={isUserLoggedIn}
          operations_link={'/moderator/operations/'}
          username={username}
          handleLogoutClick={handleLogoutClick}
        />
      <div className="container">
        <div className="row">
        <div className="header-container">
          <Breadcrumbs items={breadcrumbsItems} />
        </div>  
          <div className="col">
            <div className="card">
              <img
                src={
                  calculationData.full_url !== '' && calculationData.full_url !== 'http://localhost:9000/pictures/None'
                    ? calculationData.full_url
                    : logoImage
                }
                alt={calculationData.full_url}
                className="card-img-top"
              />
              <div className="card-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="calculation_name" className="form-label">
                      Имя
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="calculation_name"
                      name="calculation_name"
                      value={editedData.calculation_name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="calculation_description" className="form-label">
                      Описание
                    </label>
                    <textarea
                      className="form-control form-control-dis"
                      id="calculation_description"
                      name="calculation_description"
                      value={editedData.calculation_description}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="photo" className="form-label">
                      Обновить фото
                    </label>
                    <div className="input-group">
                      <input
                        type="file"
                        className="form-control"
                        id="photo"
                        name="photo"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                      />
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={openFileInput}
                      >
                        Выберите файл
                      </button>
                    </div>
                  </div>
                  <button type="button" className="btn btn-primary" onClick={handleSaveChanges}>
                    Сохранить
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeratorCalculationsNewPage;