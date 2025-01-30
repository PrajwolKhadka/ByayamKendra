import React from 'react';
import { useLocation } from 'react-router-dom';
import { Suspense } from 'react';

const Header=React.lazy(()=>import("./Header.jsx"));
const Dashboard= React.lazy(()=>import("./Dashboard.jsx"))
const Tracker= React.lazy(()=>import("./Tracker.jsx"))
const Suggest= React.lazy(()=>import("./Suggestion.jsx"))
const Generator= React.lazy(()=>import("./Generator.jsx"))
const Feature=()=>{
    const location = useLocation();
    return(
        <>
        <Suspense fallback={<div>Loading...</div>}>
            <Header />
            {location.pathname === '/dashboard' ? (
        <>
        <Dashboard/>
        </>
      ):location.pathname === '/tracker' ? (
        <>
        <Tracker/>
        </>
      ):location.pathname === '/suggest' ? (
        <>
        <Suggest/>
        </>
      ):location.pathname === '/generate' ? (
        <>
        <Generator/>
        </>
      ):(
        <div>404 Page Not Found</div>
      )}
        </Suspense>
        </>
    );
}

export default Feature;