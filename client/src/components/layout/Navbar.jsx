import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Menu, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // Close menu on navigation
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const navLinks = [
    { name: 'Destinations', path: '/destinations' },
    { name: 'Our Vision', path: '/vision' },
    { name: 'Dashboard', path: '/dashboard', auth: true },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full h-[80px] z-[60] bg-st-primary/80 backdrop-blur-[12px] border-b border-st-charcoal/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center">
              <Link to={user ? "/dashboard" : "/"} className="flex items-center group">
                <span className="font-black text-xl tracking-tighter text-st-charcoal uppercase block group-hover:text-st-accent transition-colors duration-500">Super Travel</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-12">
              {navLinks.map((link) => (
                (!link.auth || (link.auth && user)) && (
                  <Link 
                    key={link.name}
                    to={link.path} 
                    className={`text-[10px] uppercase tracking-[0.4em] font-black transition-all duration-500 ${
                      location.pathname === link.path ? 'text-st-accent' : 'text-st-charcoal/40 hover:text-st-charcoal'
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              ))}
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
              {user ? (
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="hidden sm:flex items-center gap-3">
                    <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-st-charcoal/10" />
                  </div>
                  <button onClick={handleLogout} className="hidden sm:block text-st-charcoal/40 hover:text-red-500 transition-colors" title="Log out">
                    <LogOut size={16} />
                  </button>
                  <Link to="/trips/new" className="bg-st-accent text-st-charcoal px-6 sm:px-10 py-3 rounded-full text-[10px] uppercase tracking-[0.2em] font-black hover:scale-105 transition-transform duration-500 shadow-sm shadow-st-accent/20">
                    New Trip
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-4 sm:gap-8">
                  <Link to="/login" className="hidden sm:block text-[10px] uppercase tracking-[0.2em] font-black text-st-charcoal/70 hover:text-st-charcoal transition-colors">
                    Portal
                  </Link>
                  <Link to="/register" className="bg-st-accent text-st-charcoal px-6 sm:px-10 py-3 rounded-full text-[10px] uppercase tracking-[0.2em] font-black hover:scale-105 transition-transform duration-500 shadow-sm shadow-st-accent/20">
                    Join
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 text-st-charcoal flex items-center justify-center relative z-[70]"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[55] bg-st-primary/95 backdrop-blur-2xl lg:hidden transition-all duration-700 ease-in-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col h-full px-8 pt-32 pb-12 overflow-y-auto">
          <div className="flex flex-col gap-10">
            {navLinks.map((link, idx) => (
              (!link.auth || (link.auth && user)) && (
                <Link 
                  key={link.name}
                  to={link.path}
                  className={`text-6xl font-black uppercase tracking-tighter transition-all duration-500 delay-[${idx * 100}ms] ${
                    isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  } ${location.pathname === link.path ? 'text-st-accent' : 'text-st-charcoal'}`}
                >
                  {link.name}
                </Link>
              )
            ))}
            {!user && (
              <Link 
                to="/login"
                className={`text-6xl font-black uppercase tracking-tighter text-st-charcoal opacity-40 hover:opacity-100 transition-all duration-500 ${
                    isOpen ? 'translate-y-0 opacity-40' : 'translate-y-10 opacity-0'
                }`}
              >
                Portal
              </Link>
            )}
            {user && (
              <button 
                onClick={handleLogout}
                className={`text-6xl font-black uppercase tracking-tighter text-red-500/40 hover:text-red-500 text-left transition-all duration-500 ${
                    isOpen ? 'translate-y-0 opacity-40' : 'translate-y-10 opacity-0'
                }`}
              >
                Log Out
              </button>
            )}
          </div>

          <div className="mt-auto pt-12 border-t border-st-charcoal/10">
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-st-charcoal/40 mb-6 flex items-center gap-2">
               Begin a journey <ArrowRight size={10} />
             </p>
             <Link to="/trips/new" className="text-2xl font-black uppercase tracking-tighter text-st-accent underline decoration-2 underline-offset-4">
               Design your itinerary
             </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
