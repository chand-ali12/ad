import React from 'react';
import { useNavigate } from 'react-router-dom';
import BrandHero from '../../sections/BrandSection/BrandHero/BrandHero';
import PremiumAuthentication from '../../sections/BrandSection/PremiumAuthentication/PremiumAuthentication';
import ServiceSection from '../../sections/BrandSection/ServiceSection/ServiceSection';
import DateCodeReference from '../../sections/BrandSection/DateCodeReference/DateCodeReference';
import AppDownload from '../../sections/BrandSection/AppDownload/AppDownload';

const Balenciaga = () => {
    const navigate = useNavigate();

    const handleExploreClick = () => {
        navigate('/authentication');
    };

    const handleLearnMoreClick = () => {
        console.log('Learn more clicked for Balenciaga');
    };

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
                <BrandHero
                    brandName="Balenciaga"
                    onExploreClick={handleExploreClick}
                    onLearnMoreClick={handleLearnMoreClick}
                />
                <PremiumAuthentication />
                <ServiceSection />
                <DateCodeReference />
                <AppDownload />
            </main>
        </div>
    );
};

export default Balenciaga;
