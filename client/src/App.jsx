import React, { createContext, useEffect, useState } from 'react';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; // Import Dashboard here
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import Contacts from './Components/Contacts'; // Updated import path
import AddContact from './Components/AddContact'; // Updated import path
import EditContact from './Components/EditContact';
import Logout from './Components/Logout';
import ProtectedRoutes from './Components/ProtectedRoutes';
import NotFound from './pages/NotFound';

export const UserContext = createContext(null);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/dashboard',
    element: <ProtectedRoutes><Dashboard /></ProtectedRoutes> ,
    children:[
      {
        index:true,
        element: <Contacts />
      },
      {
        path:"/dashboard/add-contact",
        element: <AddContact/>
      },
      {
        path:"/dashboard/edit-contact/:id",
        element: <EditContact/>
      }
    ]
  },
  {
    path: '/logout',
    element: <Logout />
  },
  {
    path: "*",
    element: <NotFound/>
  }
]);

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/contactmsyt/verify', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}` // Corrected typo
      }
    })
    .then(res => {
      if (res.data.success) {
        setUser(res.data.user);
      }
    })
    .catch(err => {
      console.error(err); // Use console.error for errors
    });
  }, []);

  return (
    <>
      <ToastContainer />
      <UserContext.Provider value={{ user, setUser }}>
        <RouterProvider router={router} />
      </UserContext.Provider>
    </>
  );
};

export default App;
