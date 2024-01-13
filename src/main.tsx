import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import CalculationsPage from './components/Calculations/Calculations';
import CalculationsDetailedPage from './components/CalculationsDetailed/CalculationsDetailed';
import RegistrationPage from './components/Registration'
import LoginPage from './components/LoginPage';
import ApplicationsPage from './ApplicationsPage'
import ApplicationDetailPage from './ApplicationDetailedPage'
import { Provider } from 'react-redux'; // Импортируйте Provider
import { store } from './redux/store'; // Импортируйте ваш Redux store


const router = createBrowserRouter([
  {
    path: '/login/',
    element: <LoginPage />,
  },
  {
    path: '/register/',
    element: <RegistrationPage />,
  },
  {
    path: '/operations/',
    element: <CalculationsPage />,
  },
  {
    path: '/operations/:id/',
    element: <CalculationsDetailedPage />,
  },
  {
    path: '/applications/',
    element: <ApplicationsPage />,
  },
  {
    path: '/applications/:id/',
    element: <ApplicationDetailPage />,
  },
]);

ReactDOM.render(
  <React.StrictMode>
    <hr />
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
