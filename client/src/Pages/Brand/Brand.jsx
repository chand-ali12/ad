import { useParams, useNavigate } from 'react-router-dom';
import BrandHero from '../../sections/BrandSection/BrandHero/BrandHero';
import PremiumAuthentication from '../../sections/BrandSection/PremiumAuthentication/PremiumAuthentication';
import ServiceSection from '../../sections/BrandSection/ServiceSection/ServiceSection';
import DateCodeReference from '../../sections/BrandSection/DateCodeReference/DateCodeReference';
import AppDownload from '../../sections/BrandSection/AppDownload/AppDownload';
import Balenciaga from '../Balenciaga/Balenciaga';
import Chanel from '../Chanel/Chanel';
import Hermes from '../Hermes/Hermes';
import Gucci from '../Gucci/Gucci';
import LouisVuitton from '../LouisVuitton/LouisVuitton';

const Brand = () => {
    const { brandName } = useParams();
    const navigate = useNavigate();
    const normalized = String(brandName || '').toLowerCase();

    if (normalized === 'balenciaga') return <Balenciaga />;
    if (normalized === 'chanel') return <Chanel />;
    if (normalized === 'hermes') return <Hermes />;
    if (normalized === 'gucci') return <Gucci />;
    if (normalized === 'louis-vuitton') return <LouisVuitton />;

    // Format brand name: convert dashes to spaces and capitalize each word
    const formatBrandName = (name) => {
        if (!name) return '';
        return name
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    };
    const formattedBrandName = formatBrandName(brandName);

    const handleExploreClick = () => {
        navigate('/authentication');
    };

    const handleLearnMoreClick = () => {
        console.log('Learn more clicked for brand:', formattedBrandName);
    };

    // If no brandName, show a fallback or redirect
    if (!brandName) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center">
                <h1 className="text-4xl font-bold text-primary">Brand Not Found</h1>
                <p className="text-primary mt-4">Please select a brand from the menu.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
                <BrandHero
                    brandName={formattedBrandName}
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

export default Brand;
