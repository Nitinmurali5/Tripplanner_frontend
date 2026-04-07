import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MapPin, Calendar, Users, ArrowRight, Compass, Loader2 } from 'lucide-react';
import api from '../utils/api';

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const { data } = await api.get('/trips');
        setTrips(data);
      } catch (err) {
        console.error('Error fetching trips:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-st-primary flex flex-col items-center justify-center p-8">
        <Loader2 className="w-12 h-12 text-st-accent animate-spin mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-st-charcoal/40 animate-pulse">Syncing Portfolio</p>
      </div>
    );
  }

  return (
    <div className="bg-st-primary min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div>
            <span className="text-st-accent text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Personal Portal</span>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-st-charcoal leading-[0.85]">
              Active <br /> <span className="text-st-accent">Journeys</span>
            </h1>
          </div>
          <Link to="/trips/new" className="group relative inline-flex items-center gap-4 bg-st-charcoal text-st-primary px-10 py-5 rounded-full overflow-hidden transition-all duration-500 self-start">
             <div className="absolute inset-0 bg-st-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
             <Plus size={18} className="relative z-10 group-hover:text-st-charcoal" />
             <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-st-charcoal">Curate New Trip</span>
          </Link>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-start">
          {trips.map((trip, idx) => (
            <DashboardTripCard key={trip._id} trip={trip} idx={idx} />
          ))}
          
          {/* Inspiration Card - Always show at the end or if empty */}
          <div className={`${trips.length > 0 ? 'lg:mt-24' : ''} border-2 border-dashed border-st-charcoal/10 rounded-3xl p-10 flex flex-col items-center justify-center text-center aspect-[4/5] hover:border-st-accent/50 transition-colors duration-500 group animate-in fade-in zoom-in-95 duration-1000`}>
              <Compass className="w-16 h-16 text-st-charcoal/20 group-hover:text-st-accent group-hover:rotate-45 transition-all duration-700 mb-6" />
              <h3 className="text-2xl font-black uppercase tracking-tighter text-st-charcoal mb-4">Finding Inspiration?</h3>
              <p className="text-st-charcoal/50 text-xs mb-8">Discover curated collections of luxury experiences across the globe.</p>
              <Link to="/destinations" className="text-[10px] font-black uppercase tracking-[0.2em] text-st-accent border-b-2 border-st-accent pb-1">
                Browse Directory
              </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardTripCard = ({ trip, idx }) => (
  <Link 
    to={`/trips/${trip._id}`} 
    className={`group block transition-all duration-1000 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-[${idx * 150}ms] ${idx % 3 === 1 ? 'lg:mt-12' : idx % 3 === 2 ? 'lg:mt-24' : ''}`}
  >
    <div className="relative aspect-[4/5] overflow-hidden rounded-3xl mb-8 bg-st-secondary shadow-sm">
      <img 
        src={trip.coverImage || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1200'} 
        alt={trip.title} 
        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
      />
      <div className="absolute top-8 left-8">
        <div className="bg-st-charcoal text-st-primary px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest uppercase">
           {trip.status}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-st-charcoal/80 to-transparent translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
         <div className="flex items-center justify-between text-st-primary">
            <div className="flex items-center gap-2">
               <Users size={14} />
               <span className="text-[10px] font-bold uppercase tracking-widest">{trip.collaborators?.length || 0} Travelers</span>
            </div>
            <ArrowRight size={20} />
         </div>
      </div>
    </div>
    
    <div>
      <h3 className="text-3xl font-black uppercase tracking-tighter text-st-charcoal group-hover:text-st-accent transition-colors duration-500 leading-none mb-2">
        {trip.title}
      </h3>
      <div className="flex items-center gap-4 text-st-charcoal/50">
        <div className="flex items-center gap-1">
          <MapPin size={12} className="text-st-accent" />
          <span className="text-[10px] font-black uppercase tracking-widest">{trip.destination}</span>
        </div>
        <div className="w-1 h-1 bg-st-charcoal/20 rounded-full"></div>
        <div className="flex items-center gap-1">
          <Calendar size={12} />
          <span className="text-[10px] font-black uppercase tracking-widest">{new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
        </div>
      </div>
    </div>
  </Link>
);

export default Dashboard;
