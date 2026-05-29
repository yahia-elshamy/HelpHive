import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import {Provider} from "react-redux";
import store from "./redux/store.js";
import Login from './pages/Login/Login.jsx';
import SignUp from './pages/Register/Register.jsx';
import ForgotPassword from './pages/ForgotPassword/ForgotPassword.jsx';
import NotFound from './pages/NotFound/NotFound.jsx';

const router = createBrowserRouter([
  {path: "/", element: <App />},
  {path: "/login", element: <Login />},
  {path: "/register", element: <SignUp />},
  {path: "/forgot-password", element: <ForgotPassword />},
  {path: "*", element: <NotFound />}
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
