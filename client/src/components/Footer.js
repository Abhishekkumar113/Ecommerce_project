import React from 'react'

import {Link}from 'react-router-dom';

export const Footer = () => {
  return (
    <div className='bg-dark text-light p-3 footer'>
         <h4 className='text-center'>All Right Reserved &copy;Abhishek</h4>
         <p className='text-center mt-3'>
            <Link to="/About">About </Link>
            <Link to="/Contact">Contact </Link>
            <Link to="/Policy">Privacy Policy</Link>
         </p>

    </div>
  )
}
