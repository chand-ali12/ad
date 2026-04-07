// import PropTypes from 'prop-types';
// import { Link, useLocation } from 'react-router-dom';
// import { FiShoppingCart } from 'react-icons/fi';

// const Header = ({
//   logoIcon,
//   logoText,
//   logoSubtext,
//   navLinks = [],
//   signUpText = "Sign Up",
//   showCart = true,
//   onSignUpClick,
//   onCartClick,
//   className = "",
//   logoClassName = "",
//   navClassName = "",
//   buttonClassName = "",
//   cartClassName = "",
// }) => {
//   const location = useLocation();

//   return (
//     <div className={`w-full ${className}`}>
//       {/* Top Dark Brown Bar */}
//       <div className="w-full h-1 bg-primary" />

//       {/* Main Navigation */}
//       <nav className="bg-secondary px-4 md:px-8 py-4">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           {/* Logo Section */}
//           <Link to="/" className={`flex items-center gap-3 ${logoClassName}`}>
//             {logoIcon && (
//               <div className="flex-shrink-0">
//                 {typeof logoIcon === 'function' ? (
//                   <logoIcon />
//                 ) : typeof logoIcon === 'string' ? (
//                   <img src={logoIcon} alt="Logo" className="w-10 h-10" />
//                 ) : (
//                   logoIcon
//                 )}
//               </div>
//             )}
//             <div className="flex flex-col">
//               {logoText && (
//                 <span className="text-2xl font-bold text-primary uppercase tracking-tight">
//                   {logoText}
//                 </span>
//               )}
//               {logoSubtext && (
//                 <span className="text-sm text-primary/70 lowercase tracking-wide">
//                   {logoSubtext}
//                 </span>
//               )}
//             </div>
//           </Link>

//           {/* Navigation Links */}
//           <div className={`hidden md:flex items-center gap-6 ${navClassName}`}>
//             {navLinks.map((link, index) => {
//               const isActive = location.pathname === link.path;
//               const isButton = link.isButton || false;
              
//               if (isButton) {
//                 return (
//                   <Link
//                     key={index}
//                     to={link.path || '#'}
//                     className="px-4 py-2 rounded-lg border border-gray-300 bg-secondary text-primary text-sm font-medium hover:bg-primary/5 transition-colors"
//                   >
//                     {link.label}
//                   </Link>
//                 );
//               }
              
//               return (
//                 <Link
//                   key={index}
//                   to={link.path || '#'}
//                   className={`text-sm text-primary/70 font-medium hover:text-primary transition-colors ${
//                     isActive ? 'text-primary underline' : ''
//                   }`}
//                 >
//                   {link.label}
//                 </Link>
//               );
//             })}
//           </div>

//           {/* Right Side Actions */}
//           <div className="flex items-center gap-4">
//             {/* Sign Up Button */}
//             {signUpText && (
//               <button
//                 onClick={onSignUpClick}
//                 className={`bg-primary text-secondary px-6 py-2 rounded-lg font-semibold text-sm hover:bg-primary-hover transition-colors ${buttonClassName}`}
//               >
//                 {signUpText}
//               </button>
//             )}

//             {/* Shopping Cart */}
//             {showCart && (
//               <button
//                 onClick={onCartClick}
//                 className={`p-2 rounded-lg border border-gray-300 bg-secondary text-primary hover:bg-primary/5 transition-colors ${cartClassName}`}
//               >
//                 {typeof FiShoppingCart === 'function' ? (
//                   <FiShoppingCart className="w-5 h-5" />
//                 ) : (
//                   FiShoppingCart
//                 )}
//               </button>
//             )}
//           </div>
//         </div>
//       </nav>

//       {/* Bottom Gold Bar */}
//       <div className="w-full h-1 bg-yellow-400" />
//     </div>
//   );
// };

// Header.propTypes = {
//   logoIcon: PropTypes.oneOfType([PropTypes.elementType, PropTypes.string, PropTypes.node]),
//   logoText: PropTypes.string,
//   logoSubtext: PropTypes.string,
//   navLinks: PropTypes.arrayOf(
//     PropTypes.shape({
//       label: PropTypes.string.isRequired,
//       path: PropTypes.string,
//       isButton: PropTypes.bool,
//     })
//   ),
//   signUpText: PropTypes.string,
//   showCart: PropTypes.bool,
//   onSignUpClick: PropTypes.func,
//   onCartClick: PropTypes.func,
//   className: PropTypes.string,
//   logoClassName: PropTypes.string,
//   navClassName: PropTypes.string,
//   buttonClassName: PropTypes.string,
//   cartClassName: PropTypes.string,
// };

// export default Header;
