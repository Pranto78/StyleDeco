import React from 'react';
import Hero from '../../components/Hero/Hero';
import FeaturedService from '../../components/FeaturedService/FeaturedService';
import About from '../../components/About/About';
import Contact from '../../components/Contact/Contact';

const Home = () => {
    return (
        <div>
            <Hero></Hero>
            <FeaturedService></FeaturedService>
            <About></About>
            <Contact></Contact>
        </div>
    );
};

export default Home;