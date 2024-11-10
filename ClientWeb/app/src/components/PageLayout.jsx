import React from 'react';
import Navbar2 from './Navbar';
import Footer from './Footer';

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