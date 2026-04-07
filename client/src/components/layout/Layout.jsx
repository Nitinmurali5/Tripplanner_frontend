import { Outlet, Link } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-st-primary text-st-charcoal font-sans selection:bg-st-accent selection:text-st-charcoal">
      <Navbar />
      <main className="flex-grow pt-[80px]">
        <Outlet />
      </main>
      
      <footer className="bg-st-secondary pt-32 pb-12 w-full mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8 mb-24">
            {/* Left 5 cols */}
            <div className="md:col-span-5">
              <h2 className="font-black text-3xl tracking-tighter uppercase mb-6">Super Travel</h2>
              <p className="text-st-charcoal/60 leading-relaxed max-w-sm">
                Curating premium itineraries for the world's most discerning explorers. Elevate your journey with our signature concierge planning.
              </p>
            </div>
            
            {/* Right 7 cols */}
            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-st-accent mb-8 inline-block border-b border-st-accent pb-2">Navigation</h3>
                <ul className="space-y-4">
                  <li><Link to="/login" className="font-medium text-st-charcoal hover:text-st-accent transition-colors">Client Portal</Link></li>
                  <li><Link to="/destinations" className="font-medium text-st-charcoal hover:text-st-accent transition-colors">Destinations</Link></li>
                  <li><Link to="/vision" className="font-medium text-st-charcoal hover:text-st-accent transition-colors">Our Vision</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-st-accent mb-8 inline-block border-b border-st-accent pb-2">Social</h3>
                <ul className="space-y-4">
                  <li><a href="#" className="font-medium text-st-charcoal hover:text-st-accent transition-colors">Instagram</a></li>
                  <li><a href="#" className="font-medium text-st-charcoal hover:text-st-accent transition-colors">Twitter // X</a></li>
                  <li><a href="#" className="font-medium text-st-charcoal hover:text-st-accent transition-colors">Pinterest</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-st-accent mb-8 inline-block border-b border-st-accent pb-2">Locations</h3>
                <ul className="space-y-4">
                  <li><span className="font-medium text-st-charcoal">New York</span></li>
                  <li><span className="font-medium text-st-charcoal">Paris</span></li>
                  <li><span className="font-medium text-st-charcoal">Tokyo</span></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-st-charcoal/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[9px] uppercase tracking-widest text-st-charcoal/30">
              © {new Date().getFullYear()} Super Travel. All rights reserved.
            </p>
            <div className="flex gap-8">
              <a href="#" className="text-[9px] uppercase tracking-widest text-st-charcoal/30 hover:text-st-charcoal transition-colors">Privacy Policy</a>
              <a href="#" className="text-[9px] uppercase tracking-widest text-st-charcoal/30 hover:text-st-charcoal transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
