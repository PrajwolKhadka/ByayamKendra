import React from 'react';
import { useLocation } from 'react-router-dom';
import { Suspense } from 'react';
const Header=React.lazy(()=>import("./Header.jsx"));
const Dashboard= React.lazy(()=>import("./Dashboard.jsx"))
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
      ): (
        <div>404 Page Not Found</div>
      )}
        </Suspense>
        </>
    );
}

export default Feature;