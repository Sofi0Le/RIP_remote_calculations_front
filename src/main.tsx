import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import CalculationsPage from './components/Calculations/Calculations';
import CalculationsDetailedPage from './components/CalculationsDetailed/CalculationsDetailed';
import RegistrationPage from './components/Registration'
import LoginPage from './components/LoginPage';
import ModeratorCalculationsPage from './Moderator_calculations';
import ModeratorCalculationsChangePage from './Moderator_calculations_change';
import ModeratorCalculationsNewPage from './Moderator_calculations_new'
import ApplicationsPage from './ApplicationsPage'
import ApplicationDetailPage from './ApplicationDetailedPage'
import { Provider } from 'react-redux'; // Импортируйте Provider
import { store } from './redux/store'; // Импортируйте ваш Redux store


const router = createBrowserRouter([
  {
    path: '/moderator/operations/new/',
    element: <ModeratorCalculationsNewPage />,
  },
  {
    path: '/moderator/operations/',
    element: <ModeratorCalculationsPage />,
  },
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
    path: '/moderator/operations/change/:id/',
    element: <ModeratorCalculationsChangePage />,
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
