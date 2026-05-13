import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import brandPageImage from '../../assets/images/brand_page.png';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getBrands } from '../../store/slices/brandsSlice';
import { fetchAuthenticateNowView } from '../../store/slices/authenticationRequestSlice';

const BRAND_LINKS = [
  { label: 'Chanel' },
  { label: 'Hermès' },
  { label: 'Gucci' },
  { label: 'Louis Vuitton' },
  { label: 'Balenciaga' },
];

// Map from label (as it appears in the list) to its dedicated route
const DEDICATED_BRAND_ROUTES = {
  'chanel': '/brand/chanel',
  'hermès': '/brand/hermes',
  'hermes': '/brand/hermes',
  'gucci': '/brand/gucci',
  'louis vuitton': '/brand/louis-vuitton',
  'balenciaga': '/brand/balenciaga',
};

// 4 featured brands to show as visual cards
const FEATURED_BRANDS = [
  {
    label: 'Chanel',
    route: '/brand/chanel',
    tagline: 'Chanel Authentication',
    description: 'Founded in 1910 by Coco Chanel in Paris. Known for timeless elegance, the iconic Classic Flap Bag, tweed suits, and Chanel No. 5 perfume.',
  },
  {
    label: 'Hermès',
    route: '/brand/hermes',
    tagline: 'Hermès Authentication',
    description: 'Founded in 1837 by Thierry Hermès. Renowned for handcrafted luxury and iconic pieces like the Birkin and Kelly bags, produced by single master artisans.',
  },
  {
    label: 'Gucci',
    route: '/brand/gucci',
    tagline: 'Gucci Authentication',
    description: 'Founded in 1921 by Guccio Gucci in Florence. Known for Italian craftsmanship, the GG monogram, and iconic designs like the Dionysus and Marmont bags.',
  },
  {
    label: 'Louis Vuitton',
    route: '/brand/louis-vuitton',
    tagline: 'Louis Vuitton Authentication',
    description: 'Founded in 1854 in Paris. Renowned for the iconic LV monogram, exceptional leather goods, and over a century of precision craftsmanship.',
  },
];

const Brands = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useAppDispatch();
  const searchWrapRef = useRef(null);
  const inputRef = useRef(null);
  const [dropdownRect, setDropdownRect] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { brands: apiBrands = [], status: brandsStatus } = useAppSelector((state) => state.brands || {});
  const { brands: authBrands = [], viewLoading } = useAppSelector((state) => state.authenticationRequest || {});

  // Load full brands list once when page mounts
  useEffect(() => {
    dispatch(getBrands({ source: 'BrandsPage' }));
    dispatch(fetchAuthenticateNowView({ source: 'BrandsPage' }));
  }, [dispatch]);

  // Combine all brands from both sources.
  // Always render alphabetically (requirement).
  const allBrands = useMemo(() => {
    const seen = new Set();
    const out = [];

    const addName = (raw) => {
      const name = String(raw ?? '').trim();
      if (!name) return;
      const key = name.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      out.push({ label: name });
    };

    // Ensure the common/dedicated brands are always present in the list.
    BRAND_LINKS.forEach((b) => addName(b.label));

    // Merge both sources (avoids "5 then all" and avoids swapping lists depending on which fetch finishes first).
    const merged = [
      ...(Array.isArray(apiBrands) ? apiBrands : []),
      ...(Array.isArray(authBrands) ? authBrands : []),
    ];
    merged.forEach((b) => addName(b?.brand ?? b?.name ?? b?.brand_name));

    const collator = new Intl.Collator('en', { sensitivity: 'base' });
    out.sort((a, b) => collator.compare(a.label, b.label));
    return out;
  }, [apiBrands, authBrands]);

  const isInitialLoading =
    (brandsStatus === 'idle' || brandsStatus === 'loading' || viewLoading) &&
    allBrands.length <= BRAND_LINKS.length;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchQuery.trim().toLowerCase();
    if (!trimmed) return;

    const exact = allBrands.find((b) => b.label?.toLowerCase() === trimmed);
    const startsWith = allBrands.find((b) =>
      (b.label || '').toLowerCase().startsWith(trimmed),
    );
    const includes = allBrands.find((b) =>
      (b.label || '').toLowerCase().includes(trimmed),
    );

    const match = exact || startsWith || includes;
    // List-only: never navigate from this page.
    if (match?.label) {
      setSearchQuery(match.label);
      setIsDropdownOpen(false);
      inputRef.current?.blur?.();
    }
  };

  const filteredBrands = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return allBrands.filter((b) => (b.label || '').toLowerCase().includes(q));
  }, [allBrands, searchQuery]);

  const updateDropdownRect = () => {
    const el = searchWrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setDropdownRect({
      left: rect.left,
      right: rect.right,
      top: rect.bottom,
      width: rect.width,
    });
  };

  useEffect(() => {
    const update = () => updateDropdownRect();
    if (filteredBrands.length) update();

    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update);
    };
  }, [filteredBrands.length]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsDropdownOpen(false);
    };
    const onMouseDown = (e) => {
      const wrap = searchWrapRef.current;
      if (!wrap) return;
      if (!wrap.contains(e.target)) setIsDropdownOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onMouseDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onMouseDown);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero: Our Brands - mobile responsive */}
        <section
          className="relative w-full min-h-[280px] sm:min-h-[380px] md:min-h-[460px] lg:h-[546px] flex flex-col items-center justify-center text-center px-4 py-10 sm:py-12 overflow-x-hidden"
          style={{ marginTop: 0 }}
        >
          <div
            className="absolute top-0 left-0 right-0 bottom-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${brandPageImage})`,
              width: '100%',
              opacity: 1,
              transform: 'rotate(0deg)',
            }}
            aria-hidden
          />
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(60, 31, 27, 0.65)' }}
            aria-hidden
          />
          {isDropdownOpen && searchQuery.trim() && filteredBrands.length > 0 && (
            <div
              className="absolute inset-0 z-[5] backdrop-blur-sm"
              style={{ backgroundColor: 'rgba(60, 31, 27, 0.25)' }}
              aria-hidden
            />
          )}
          <div className="relative z-10 w-full max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 md:mb-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Our Brands
            </h1>
            <form
              ref={searchWrapRef}
              onSubmit={handleSearchSubmit}
              className="w-full px-2 sm:px-0 relative max-w-xl mx-auto"
            >
              <input
                ref={inputRef}
                type="search"
                placeholder="Search brands"
                value={searchQuery}
                onChange={(e) => {
                  const next = e.target.value;
                  setSearchQuery(next);
                  if (next.trim()) setIsDropdownOpen(true);
                  requestAnimationFrame(() => updateDropdownRect());
                }}
                onFocus={() => {
                  if (searchQuery.trim()) setIsDropdownOpen(true);
                  requestAnimationFrame(() => updateDropdownRect());
                }}
                className="w-full block px-4 sm:px-5 py-3 sm:py-3.5 md:py-4 rounded-lg border-0 bg-white text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm sm:text-base"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
                aria-label="Search brands"
                autoComplete="off"
              />
              {isDropdownOpen &&
                searchQuery.trim() &&
                filteredBrands.length > 0 &&
                dropdownRect && (
                <ul
                  className="fixed mt-1 max-h-52 overflow-y-auto scrollbar-hide bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg text-left z-[9999]"
                  style={{
                    left: dropdownRect.left + 12,
                    width: Math.max(240, dropdownRect.width - 24),
                    top: dropdownRect.top,
                  }}
                >
                  {filteredBrands.map((brand) => (
                    <li
                      key={brand.label}
                      className="px-3 py-1.5 text-sm sm:text-base text-primary hover:bg-gray-100 cursor-pointer"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setSearchQuery(brand.label);
                        setIsDropdownOpen(false);
                        inputRef.current?.blur?.();
                      }}
                    >
                      {brand.label}
                    </li>
                  ))}
                </ul>
              )}
            </form>
          </div>
        </section>

        {/* Featured Brands Section */}
        <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-10 sm:py-14 md:py-16 lg:py-20" style={{ backgroundColor: '#F5F5F0' }}>
          <div className="max-w-7xl mx-auto">
            {/* Section heading */}
            <div className="mb-8 sm:mb-10 md:mb-12">
              <h2
                className="text-primary inline-block mb-1"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 700,
                  fontSize: 'clamp(1.5rem, 4vw, 40px)',
                  lineHeight: '1.2',
                  letterSpacing: '0.34px',
                }}
              >
                Featured Brands
              </h2>
              <div
                className="rounded-full bg-[#E5C84B] w-full max-w-[502px]"
                style={{ height: 4, marginTop: '0.75em' }}
                aria-hidden
              />
              <p
                className="mt-4 text-primary/70 text-sm sm:text-base max-w-2xl"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Expert authentication services for the world's most coveted luxury brands.
              </p>
            </div>

            {/* Brand cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
              {FEATURED_BRANDS.map((brand) => (
                <div
                  key={brand.label}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col"
                  style={{ border: '1px solid rgba(60,31,27,0.1)' }}
                >
                  {/* Card header */}
                  <div className="px-6 pt-6 pb-4 flex-grow">
                    <div
                      className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4"
                      style={{
                        backgroundColor: '#DEDBD6',
                        color: '#3C1F1B',
                        fontFamily: 'Montserrat, sans-serif',
                      }}
                    >
                      Professional
                    </div>
                    <h3
                      className="text-primary font-bold text-xl sm:text-2xl mb-3"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {brand.label}
                    </h3>
                    <p
                      className="text-primary/70 text-sm leading-relaxed"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      {brand.description}
                    </p>
                  </div>

                  {/* Card footer */}
                  <div className="px-6 pb-6 pt-2">
                    <Link
                      to={brand.route}
                      className="inline-flex items-center gap-2 w-full justify-center py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors"
                      style={{
                        backgroundColor: '#3C1F1B',
                        color: '#FFFFFF',
                        fontFamily: 'Montserrat, sans-serif',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#5a2f28'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#3C1F1B'; }}
                    >
                      View Details
                      <FiArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* All Brands list section */}
        <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-10 md:py-12 lg:py-14 text-left bg-white">
          <div
            className="flex flex-col w-full max-w-7xl mx-auto gap-10 sm:gap-12 lg:gap-16"
          >
            <div className="w-full max-w-[582px] min-h-[64px]" style={{ opacity: 1, transform: 'rotate(0deg)' }}>
              <h2
                className="text-primary mb-1 inline-block"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 700,
                  fontStyle: 'normal',
                  fontSize: 'clamp(1.5rem, 4vw, 40px)',
                  lineHeight: '22.84px',
                  letterSpacing: '0.34px',
                  textAlign: 'left',
                }}
              >
                All Brands
              </h2>
              <div
                className="rounded-full bg-[#E5C84B] w-full max-w-[502px]"
                style={{ height: 4, marginTop: '2.2em' }}
                aria-hidden
              />
            </div>
            {isInitialLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-3 gap-x-10">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-5 w-40 max-w-full rounded bg-primary/10 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-y-2 sm:gap-y-3 gap-x-10 lg:gap-x-14 justify-start">
                {allBrands.map((brand) => {
                  const route = DEDICATED_BRAND_ROUTES[brand.label?.toLowerCase()];
                  return route ? (
                    <Link
                      key={brand.label}
                      to={route}
                      className="text-primary/90 hover:text-primary hover:underline text-sm sm:text-base transition-colors"
                      style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: 400,
                        fontStyle: 'normal',
                        lineHeight: '26px',
                        letterSpacing: 0,
                      }}
                    >
                      {brand.label}
                    </Link>
                  ) : (
                    <span
                      key={brand.label}
                      className="text-primary/90 text-sm sm:text-base"
                      style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: 400,
                        fontStyle: 'normal',
                        lineHeight: '26px',
                        letterSpacing: 0,
                      }}
                    >
                      {brand.label}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Brands;
