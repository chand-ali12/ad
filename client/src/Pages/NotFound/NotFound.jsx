import { useNavigate } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div
      className="w-full min-h-[60vh] bg-[#F5F5F0] px-4 sm:px-6 lg:px-8 py-10 sm:py-14"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="bg-secondary border border-primary/10 shadow-sm px-5 sm:px-8 py-10 sm:py-12 text-center">
          <h1 className="text-primary font-bold leading-none tracking-tight text-[clamp(3.25rem,10vw,6.75rem)]">
            404
          </h1>
          <p className="mt-3 text-primary/70 text-sm sm:text-base leading-relaxed">
            The page you’re looking for doesn’t exist or has been moved.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center justify-center gap-2 bg-primary text-secondary px-5 py-3 font-semibold hover:bg-primary-hover transition-colors"
              style={{ borderRadius: 12 }}
            >
              <FiHome className="w-5 h-5" />
              Go Home
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center justify-center gap-2 bg-secondary text-primary border border-primary/15 px-5 py-3 font-semibold hover:bg-primary/5 transition-colors"
              style={{ borderRadius: 12 }}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
