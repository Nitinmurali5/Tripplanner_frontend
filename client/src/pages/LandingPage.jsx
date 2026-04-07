import { Link } from 'react-router-dom';
import { ArrowRight, Map, Users, Wallet } from 'lucide-react';
import RevealWrapper from '../components/layout/RevealWrapper';

const LandingPage = () => {
  return (
    <div className="bg-st-primary overflow-hidden">
      
      {/* Hero Section */}
      <section className="min-h-screen relative flex items-center pt-[80px]">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 z-10 relative">
              <RevealWrapper delay={100}>
                <h1 className="font-black text-[15vw] lg:text-[12vw] leading-[0.8] tracking-tighter text-st-charcoal uppercase mb-12">
                  Super <br />
                  <span className="italic lowercase text-st-accent font-bold">travel</span>
                </h1>
              </RevealWrapper>
              
              <RevealWrapper delay={300}>
                <div className="pl-2 lg:pl-4 border-l-2 border-st-accent/30 max-w-xl mb-12">
                  <p className="text-2xl text-st-charcoal/70 leading-relaxed font-medium">
                    The ultimate collaborative itinerary planner. Build your dream trip, split expenses, and coordinate with friends in real-time.
                  </p>
                </div>
              </RevealWrapper>

              <RevealWrapper delay={500}>
                <Link to="/register" className="inline-flex items-center gap-4 text-st-charcoal uppercase text-[10px] font-black tracking-[0.4em] border-b-2 border-st-accent pb-2 hover:text-st-accent transition-colors">
                  Plan your escape <ArrowRight size={16} />
                </Link>
              </RevealWrapper>
            </div>

            {/* Hero Right Media */}
            <div className="lg:col-span-5 relative mt-16 lg:mt-0">
              <RevealWrapper delay={700}>
                <div className="relative aspect-[3/4] w-full max-w-md mx-auto lg:ml-auto right-0 rounded-[24px] overflow-hidden group">
                  <img 
                    src="https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=800&q=80" 
                    alt="Paris Eiffel Tower" 
                    className="w-full h-full object-cover grayscale-hover"
                  />
                  
                  {/* Floating Concierge Badge */}
                  <div className="absolute -left-12 -top-12 md:-left-20 md:-top-16 w-[160px] h-[160px] bg-st-accent rounded-full flex flex-col items-center justify-center text-st-charcoal shadow-2xl animate-bounce-slow border-4 border-st-primary z-20">
                    <span className="text-4xl font-black italic">01</span>
                    <span className="text-[8px] uppercase tracking-[0.4em] font-bold mt-1">Concierge</span>
                  </div>
                </div>
              </RevealWrapper>
            </div>

          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-st-secondary py-32">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          <RevealWrapper>
            <h2 className="font-black text-6xl md:text-8xl tracking-tighter uppercase text-st-charcoal mb-24">
              Signature <br /> <span className="text-st-accent italic lowercase">services</span>
            </h2>
          </RevealWrapper>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 md:gap-y-0 relative">
            <div className="absolute top-0 bottom-0 left-1/3 w-px bg-st-charcoal/10 hidden md:block"></div>
            <div className="absolute top-0 bottom-0 right-1/3 w-px bg-st-charcoal/10 hidden md:block"></div>

            <RevealWrapper delay={200}>
              <div className="p-10 group hover:bg-st-accent transition-colors duration-1000 ease-super h-full">
                <Map className="w-16 h-16 text-st-accent group-hover:text-st-charcoal transition-colors duration-700 ease-super mb-12" strokeWidth={1.5} />
                <h3 className="font-black text-2xl uppercase tracking-tighter mb-4 text-st-charcoal">Smart Itineraries</h3>
                <p className="text-sm leading-relaxed text-st-charcoal/70 group-hover:text-st-charcoal border-t border-st-charcoal/10 pt-6">
                   Build day-by-day plans, add structured locations, and curate your schedule. Every minute detail syncs instantly across devices.
                </p>
              </div>
            </RevealWrapper>

            <RevealWrapper delay={400}>
              <div className="p-10 group hover:bg-st-accent transition-colors duration-1000 ease-super h-full">
                <Users className="w-16 h-16 text-st-accent group-hover:text-st-charcoal transition-colors duration-700 ease-super mb-12" strokeWidth={1.5} />
                <h3 className="font-black text-2xl uppercase tracking-tighter mb-4 text-st-charcoal">Co-Creation</h3>
                <p className="text-sm leading-relaxed text-st-charcoal/70 group-hover:text-st-charcoal border-t border-st-charcoal/10 pt-6">
                   See who's editing what instantly. Say goodbye to messy spreadsheets. You and your friends command the same high-end canvas.
                </p>
              </div>
            </RevealWrapper>

            <RevealWrapper delay={600}>
              <div className="p-10 group hover:bg-st-accent transition-colors duration-1000 ease-super h-full">
                <Wallet className="w-16 h-16 text-st-accent group-hover:text-st-charcoal transition-colors duration-700 ease-super mb-12" strokeWidth={1.5} />
                <h3 className="font-black text-2xl uppercase tracking-tighter mb-4 text-st-charcoal">Expense Splitter</h3>
                <p className="text-sm leading-relaxed text-st-charcoal/70 group-hover:text-st-charcoal border-t border-st-charcoal/10 pt-6">
                  Track exactly who paid for what. Let TripSync calculate the complex balances so you only have to settle up once.
                </p>
              </div>
            </RevealWrapper>
          </div>
        </div>
      </section>

      {/* Portfolio Staggered Grid */}
      <section className="bg-st-primary py-32">
        <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8">
          
          <RevealWrapper delay={100}>
            <div className="mb-24 flex justify-between items-end">
              <h2 className="font-black text-6xl md:text-8xl tracking-tighter uppercase text-st-charcoal">
                Featured <br /> <span className="text-st-accent italic lowercase">destinations</span>
              </h2>
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-st-charcoal/50 pb-4 hidden md:block">
                Curated portfolio
              </span>
            </div>
          </RevealWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-32 md:pb-32">
            
            {/* Gallery Item ODD */}
            <RevealWrapper delay={300}>
              <div className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-[16px] aspect-[3/4] mb-8 bg-black">
                  <img 
                    src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1000&q=80" 
                    alt="Tokyo" 
                    className="w-full h-full object-cover grayscale-hover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-super z-10 pointer-events-none">
                    <div className="w-[96px] h-[96px] bg-st-charcoal rounded-full flex items-center justify-center text-st-primary text-[10px] font-bold uppercase tracking-[0.2em] shadow-2xl">
                       View Case
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-st-accent font-black tracking-[0.4em] uppercase mb-4">Asia Pacific</div>
                <h3 className="font-black text-3xl md:text-5xl tracking-tighter text-st-charcoal uppercase mb-2">Tokyo Lights</h3>
                <p className="text-st-charcoal/50 text-sm font-medium tracking-wide">Culture • Cuisine • Cyberpunk</p>
              </div>
            </RevealWrapper>

            {/* Gallery Item EVEN (OFFSET) */}
            <RevealWrapper delay={500}>
              <div className="group cursor-pointer md:mt-[150px]">
                <div className="relative overflow-hidden rounded-[16px] aspect-[3/4] mb-8 bg-black">
                  <img 
                    src="https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1000&q=80" 
                    alt="New York" 
                    className="w-full h-full object-cover grayscale-hover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-super z-10 pointer-events-none">
                    <div className="w-[96px] h-[96px] bg-st-charcoal rounded-full flex items-center justify-center text-st-primary text-[10px] font-bold uppercase tracking-[0.2em] shadow-2xl">
                       View Case
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-st-accent font-black tracking-[0.4em] uppercase mb-4">North America</div>
                <h3 className="font-black text-3xl md:text-5xl tracking-tighter text-st-charcoal uppercase mb-2">Empire State</h3>
                <p className="text-st-charcoal/50 text-sm font-medium tracking-wide">Metropolis • Arts • Finance</p>
              </div>
            </RevealWrapper>

          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
