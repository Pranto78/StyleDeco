import React from 'react';
import Hero from '../../components/Hero/Hero';
import FeaturedService from '../../components/FeaturedService/FeaturedService';
import About from '../../components/About/About';

const Home = () => {
    return (
        <div>
            <Hero></Hero>
            <FeaturedService></FeaturedService>
            <About></About>
        </div>
    );
};

export default Home;