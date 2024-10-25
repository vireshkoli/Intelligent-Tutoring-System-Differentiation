import React from 'react'
import "./Header.css"

import headerimg from "./headerimg.png"

function Header() {
  return (
    <div className="container-fluid header-container d-flex bg-info-subtle bg-gradient">
        <div className="header-content">
            <h2 className='fw-bolder header-text'>Best Intelligent Tutor</h2>
            <h2 className='text-primary fs-1 fw-bolder'>For Calculus</h2>
            <p className='fs-6 fw-semibold'>The Intelligent Tutor System for Calculus provides personalized lessons, real-time feedback, and interactive problem-solving. It adapts to your learning pace, identifies areas for improvement, and helps you master calculus concepts efficiently, making calculus both understandable and engaging.</p>
            <a href="/" class="btn btn-primary">Get Started</a>
        </div>
        <div className="header-image">
            <img src={headerimg} alt="headerimg" />
        </div>
    </div>
  )
}

export default Header