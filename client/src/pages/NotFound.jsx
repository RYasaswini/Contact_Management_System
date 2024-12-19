import React from 'react'
import {Link} from 'react-router-dom'
import '../assets/css/dashboard.css';

const NotFound = () =>{
  return (
   <div className='not-found'>
    <h1>404</h1>
    <h1>Not Found</h1>
    <h2>Go <Link to="/">Home</Link></h2>
   </div>
  )
}

export default NotFound