import React from 'react';
import PageLayout from './PageLayout';

function Home() {
    return (
        <PageLayout>
            <div className="container mx-auto px-4 h-screen">
                <h1 className="text-primary-100 text-4xl font-bold text-center mt-8">Welcome to Mod-Ed</h1>
                <p className="text-primary-100 text-lg text-center mt-4">The best place to learn and grow</p>
            </div>
            <div className="container mx-auto px-4 h-screen">
                <h2 className="text-primary-100 text-3xl font-bold text-center mt-8">Section 1</h2>
                <p className="text-primary-100 text-lg text-center mt-4">Content for section 1</p>
            </div>
        </PageLayout>
    );
}

export default Home;