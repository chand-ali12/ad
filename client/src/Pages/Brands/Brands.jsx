import { useEffect, useMemo, useRef, useState } from 'react';
import brandPageImage from '../../assets/images/brand_page.png';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { getBrands } from '../../store/slices/brandsSlice';
import { fetchAuthenticateNowView } from '../../store/slices/authenticationRequestSlice';

// Dedicated brand pages exist, but this screen should be list-only (no navigation).
const BRAND_LINKS = [
  { label: 'Chanel' },
  { label: 'Hermès' },
  { label: 'Gucci' },
  { label: 'Louis Vuitton' },
  { label: 'Balenciaga' },
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

        {/* Brands list section - brand and brand name location, mobile responsive */}
        <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-10 md:py-12 lg:py-14 text-left" style={{ backgroundColor: '#F5F5F0' }}>
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
                Brands
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
                {allBrands.map((brand) => (
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
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Brands;
