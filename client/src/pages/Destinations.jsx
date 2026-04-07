import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';

const DESTINATIONS = [
  {
    id: 1,
    name: 'Santorini',
    country: 'Greece',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=1200',
    description: 'Crystal-clear azure waters and iconic white-washed cliff-side architecture.',
    category: 'Coastal'
  },
  {
    id: 2,
    name: 'Kyoto',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1200',
    description: 'Ancient temples, bamboo forests, and the serene beauty of cherry blossoms.',
    category: 'Cultural'
  },
  {
    id: 3,
    name: 'Amalfi Coast',
    country: 'Italy',
    image: 'https://images.unsplash.com/photo-1633321088355-d0f81134ca3b?auto=format&fit=crop&q=80&w=1200',
    description: 'Dramatic coastal cliffs, turquoise bays, and vibrant Mediterranean villages.',
    category: 'Coastal'
  },
  {
    id: 4,
    name: 'Reykjavik',
    country: 'Iceland',
    image: 'https://images.unsplash.com/photo-1504109586057-7a2ae83d1338?auto=format&fit=crop&q=80&w=1200',
    description: 'Raw volcanic landscapes, geothermal springs, and the ethereal Northern Lights.',
    category: 'Adventure'
  },
  {
    id: 5,
    name: 'Marrakech',
    country: 'Morocco',
    image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&q=80&w=1200',
    description: 'Vibrant spice-scented souks, ornate riads, and the legendary Jardin Majorelle.',
    category: 'Cultural'
  },
  {
    id: 6,
    name: 'Hoi An',
    country: 'Vietnam',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80&w=1200',
    description: 'Enchanting lantern-lit ancient streets, silk tailors, and timeless heritage.',
    category: 'Heritage'
  }
];

const Destinations = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-st-primary pt-24 pb-20">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <header className="mb-20">
          <span className="text-st-accent text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Curated Directory</span>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-st-charcoal leading-[0.85]">
            World Class <br /> <span className="text-st-accent">Destinations</span>
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DESTINATIONS.map((dest, idx) => (
            <div 
              key={dest.id}
              className={`group cursor-pointer ${idx % 3 === 1 ? 'lg:mt-12' : idx % 3 === 2 ? 'lg:mt-24' : ''}`}
            >
              <div className="relative aspect-[4/5] bg-st-secondary overflow-hidden rounded-2xl mb-6 shadow-sm">
                <img 
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                />
                <div className="absolute top-6 left-6">
                   <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2">
                      <MapPin size={12} className="text-st-accent" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-st-charcoal">{dest.country}</span>
                   </div>
                </div>
              </div>
              
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-st-charcoal group-hover:text-st-accent transition-colors duration-500">
                    {dest.name}
                  </h3>
                  <p className="text-st-charcoal/50 text-xs font-semibold uppercase tracking-wider mt-1">
                    {dest.category} — {dest.description.slice(0, 40)}...
                  </p>
                </div>
                <Link to="/trips/new" className="p-4 bg-st-charcoal text-st-primary rounded-full hover:bg-st-accent hover:text-st-charcoal transition-all duration-500 group-hover:translate-x-2">
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <section className="mt-48 border-t border-st-charcoal/10 pt-20 flex flex-col items-center text-center">
             <h2 className="text-4xl text-st-charcoal font-black uppercase tracking-tighter mb-8 max-w-2xl">
                Ready to begin your <br /> next narrative?
             </h2>
             <Link to="/trips/new" className="group relative inline-flex items-center gap-4 bg-st-charcoal text-st-primary px-12 py-6 rounded-full overflow-hidden transition-all duration-500">
                <div className="absolute inset-0 bg-st-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-st-charcoal">Design your journey</span>
                <ArrowRight size={16} className="relative z-10 group-hover:text-st-charcoal group-hover:translate-x-2 transition-all duration-500" />
             </Link>
        </section>
      </div>
    </div>
  );
};

export default Destinations;
