import React, { useState } from 'react';
import logo from '/resources/newLogo.png';
import { Link } from 'react-router-dom';
import '../css/Landingpage.css';

function Header() {
    const scrollToSection = (e, id) => {
        e.preventDefault(); // Prevent default anchor behavior
        const element = document.getElementById(id);
        const headerHeight = document.querySelector('.head-small')?.offsetHeight || 70; // Get header height dynamically
        const offset = headerHeight + 5; // Add 5px extra offset
        if (element) {
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: elementPosition - offset, // Scroll to position minus offset
                behavior: 'smooth',
            });
        }
    };
    return (
        <nav className="head-small">
            <div className="logo">
                <img src={logo} alt="Logo" />
            </div>
            <div className="title">
                <ul>
                    <li className="programs-bg">
                        <a href="#" onClick={() => scrollToSection('programs')}>Programs</a>
                    </li>
                    <li className="about-bg">
                        <a href="#" onClick={(e) => scrollToSection(e, 'about')}>About</a>
                    </li>
                    <li className="plans-bg">
                        <a href="#" onClick={(e) => scrollToSection(e, 'plans')}>Collaboratos</a>
                    </li>
                </ul>
            </div>
            <div className="buttons">
                <Link to="../signup">Signup</Link> 
                <span>|</span>
                <Link to="../login">Login</Link> 
            </div>
        </nav>
    );
}

export default Header;
