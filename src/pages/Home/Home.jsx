import React from 'react';
import Hero from '../../components/Hero/Hero';
import FeaturedService from '../../components/FeaturedService/FeaturedService';
import About from '../../components/About/About';
import Contact from '../../components/Contact/Contact';
import ServiceCoverage from '../../components/ServiceCoverage/ServiceCoverage';

const Home = () => {
    return (
        <div>
            <Hero></Hero>
            <FeaturedService></FeaturedService>
            <ServiceCoverage></ServiceCoverage>
            <About></About>
            <Contact></Contact>
        </div>
    );
};

export default Home;