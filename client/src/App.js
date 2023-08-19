import React from 'react'
import './App.css';
import Nav from './Components/Nav';
import Post from './Components/Post';
import LogIn from './Components/LogIn';
import Register from './Components/Register';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import { UserContextProvider } from './UserContext';
import CreatePost from './Components/CreatePost';
import PostPage from './Components/PostPage';
import EditPost from './Components/EditPost';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Email from './Components/Email';
import PasswordRecovery from './Components/PasswordRecovery';

const App = () => {

  return (
    <UserContextProvider>
      <Router>
        <Nav />
        <Routes>
          <Route exact path='/' element={<Post />} />
          <Route exact path='/login' element={<LogIn />} />
          <Route exact path='/register' element={<Register />} />
          <Route exact path='/createpost' element={<CreatePost />} />
          <Route exact path='/post/:id' element={<PostPage/>} />
          <Route exact path='/edit/:id' element={<EditPost/>} />
          <Route exact path='/forgetpassword' element={<Email/>} />
          <Route exact path='/reset-password' element={<PasswordRecovery/>} />
        </Routes>
      </Router>
      <ToastContainer />
    </UserContextProvider>
  )
}

export default App