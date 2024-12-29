import React from 'react';
import { Suspense } from 'react';
const Body = React.lazy(() => import('../public/LandingBody'));
const Header = React.lazy(() => import('../public/LandingHeader'));

function LandingPage(){
    return(
    <>
    <Suspense>
        <Header/>
        <Body/>
    </Suspense>

    </>

    )
}
export default LandingPage;