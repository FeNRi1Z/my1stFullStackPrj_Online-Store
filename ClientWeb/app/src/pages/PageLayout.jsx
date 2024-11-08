import React from 'react';
import Navbar2 from '../components/Navbar';
import Footer from '../components/Footer';

function PageLayout(props) {
    return (
        <>
            <Navbar2 />
                {props.children}
            <Footer />
        </>
    );
}

export default PageLayout;