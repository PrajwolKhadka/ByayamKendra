import React from 'react';
import { Suspense } from 'react';
const Body = React.lazy(() => import('../public/LandingBody'));
const Header = React.lazy(() => import('../public/LandingHeader'));
const Footer = React.lazy(() => import('../public/footer'));
function LandingPage(){
    return(
    <>
    <Suspense>
        <Header/>
        <Body/>
        <Footer/>
    </Suspense>

    </>

    )
}
export default LandingPage;