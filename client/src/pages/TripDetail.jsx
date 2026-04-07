import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Plus, Share2, Calendar as CalendarIcon, DollarSign, GripVertical, Clock, Loader2, Sparkles, X, Map as MapIcon, ChevronRight, AlertCircle, Trash2 } from 'lucide-react';
import api from '../utils/api';
import TripMap from '../components/TripMap';

const TripDetail = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [isAddDayOpen, setIsAddDayOpen] = useState(false);
  const [showMapMobile, setShowMapMobile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchTrip();
  }, [id]);

  const fetchTrip = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/trips/${id}`);
      setTrip(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching trip:', err);
      setError('Failed to load trip details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDay = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const dateInput = e.target.date.value;
    
    try {
      if (!dateInput) {
        throw new Error("Please select a valid date.");
      }

      // Ensure the date is parsed correctly regardless of browser inconsistencies
      const dateObj = new Date(dateInput);
      if (isNaN(dateObj.getTime())) {
        throw new Error("The selected date is invalid.");
      }

      const isoDate = dateObj.toISOString();

      // Create new day object
      const newDay = {
        day: (trip.itinerary?.length || 0) + 1,
        date: isoDate,
        activities: []
      };

      // Create a clean copy of the itinerary
      const currentItinerary = trip.itinerary ? JSON.parse(JSON.stringify(trip.itinerary)) : [];
      const updatedItinerary = [...currentItinerary, newDay];
      
      const { data } = await api.post(`/trips/${id}/days`, { 
        day: (trip.itinerary?.length || 0) + 1,
        date: isoDate 
      });
      
      setTrip(data);
      setIsAddDayOpen(false);
      setSelectedDayIndex(data.itinerary.length - 1);
    } catch (err) {
      console.error('Error adding day:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to save day.';
      alert(`Luxury Sync Error: ${msg}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const title = e.target.title.value;
    const time = e.target.time.value;
    const location = e.target.location.value;
    const estimatedCost = Number(e.target.estimatedCost?.value || 0);
    const notes = e.target.notes?.value || '';

    const newActivity = { title, time, location, notes, estimatedCost };

    try {
      const { data } = await api.post(`/trips/${id}/days/${selectedDayIndex}/activities`, newActivity);
      setTrip(data);
      setIsAddActivityOpen(false);
    } catch (err) {
      console.error('Error adding activity:', err);
      alert('Failed to append event. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteDay = async (index) => {
    if (!window.confirm("Are you sure you want to delete this day and all its events?")) return;
    
    try {
      const { data } = await api.delete(`/trips/${id}/days/${index}`);
      setTrip(data);
      if (selectedDayIndex >= data.itinerary.length) {
        setSelectedDayIndex(Math.max(0, data.itinerary.length - 1));
      }
    } catch (err) {
      console.error('Error deleting day:', err);
    }
  };

  const handleDeleteActivity = async (activityIndex) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    
    try {
      const { data } = await api.delete(`/trips/${id}/days/${selectedDayIndex}/activities/${activityIndex}`);
      setTrip(data);
    } catch (err) {
      console.error('Error deleting activity:', err);
      alert('Failed to delete event. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-st-primary flex flex-col items-center justify-center p-8">
        <Loader2 className="w-12 h-12 text-st-accent animate-spin mb-4" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-st-charcoal/40 animate-pulse">Synchronizing Logs</p>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-st-primary flex flex-col items-center justify-center p-12">
        <AlertCircle className="w-16 h-16 text-red-400 mb-6" />
        <h2 className="text-3xl font-black uppercase tracking-tighter text-st-charcoal mb-4">Connection Terminated</h2>
        <p className="text-[10px] font-black uppercase tracking-widest text-st-charcoal/40 mb-8">{error || 'Trip data inaccessible'}</p>
        <button onClick={fetchTrip} className="bg-st-charcoal text-st-primary px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-st-accent hover:text-st-charcoal transition-all">
          Retry Sync
        </button>
      </div>
    );
  }

  const currentDay = trip.itinerary && trip.itinerary[selectedDayIndex];

  return (
    <div className="min-h-screen bg-st-primary pt-20">
      
      {/* Top Header Section */}
      <div className="bg-white border-b border-st-charcoal/5 px-4 sm:px-8 py-6 sticky top-20 z-30 backdrop-blur-xl bg-white/80">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
               <span className="bg-st-accent text-st-charcoal text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest">{trip.status}</span>
               <div className="w-1 h-1 bg-st-charcoal/20 rounded-full"></div>
               <span className="text-st-charcoal/40 text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                 <CalendarIcon size={10} /> {new Date(trip.startDate).toLocaleDateString()} — {new Date(trip.endDate).toLocaleDateString()}
               </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-st-charcoal leading-none">
              {trip.title}
            </h1>
            <p className="text-st-charcoal/50 text-[10px] font-black uppercase tracking-widest mt-3 flex items-center gap-2">
              <MapPin size={12} className="text-st-accent" /> {trip.destination}
            </p>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
             <Link to={`/trips/${id}/expenses`} className="flex-shrink-0 flex items-center gap-2 bg-st-secondary hover:bg-st-charcoal hover:text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                <DollarSign size={14} /> Ledger
             </Link>
             <button className="flex-shrink-0 flex items-center gap-2 bg-st-charcoal text-st-primary px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-st-accent hover:text-st-charcoal transition-all">
                <Sparkles size={14} /> Share Plan
             </button>
          </div>
        </div>
      </div>

      {/* Main Responsive Layout */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-10 flex flex-col lg:flex-row gap-10">
        
        {/* Left Panel: Day Selection (Responsive) */}
        <aside className="lg:w-80 flex-shrink-0">
          <div className="sticky top-60">
            <div className="flex items-center justify-between mb-8 group">
               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-st-charcoal/40 group-hover:text-st-accent transition-colors">Manifest Logs</h3>
               <button 
                onClick={() => setIsAddDayOpen(true)}
                className="p-2 bg-st-accent text-st-charcoal rounded-full hover:scale-110 transition-transform shadow-lg shadow-st-accent/20">
                 <Plus size={16} />
               </button>
            </div>
            
            <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 no-scrollbar">
              {(trip.itinerary || []).map((day, idx) => (
                <div key={idx} className="relative group/day">
                  <button 
                    onClick={() => setSelectedDayIndex(idx)}
                    className={`group relative flex-shrink-0 lg:flex items-center gap-6 p-6 rounded-[2rem] transition-all duration-500 text-left w-56 lg:w-full ${selectedDayIndex === idx ? 'bg-st-charcoal text-st-primary shadow-2xl shadow-st-charcoal/20' : 'bg-white hover:bg-st-secondary'}`}
                  >
                    <div className={`text-4xl font-black tracking-tighter leading-none ${selectedDayIndex === idx ? 'text-st-accent' : 'text-st-charcoal/10'}`}>
                      {String(day.day).padStart(2, '0')}
                    </div>
                    <div>
                      <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${selectedDayIndex === idx ? 'text-st-primary/60' : 'text-st-charcoal/30'}`}>
                        {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="text-xs font-black uppercase tracking-tight truncate w-32">Day Archive</div>
                    </div>
                    {selectedDayIndex === idx && <ChevronRight size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-st-accent" />}
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteDay(idx); }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover/day:opacity-100 transition-opacity z-10 hover:bg-red-600 shadow-lg">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              
              {(!trip.itinerary || trip.itinerary.length === 0) && (
                <div className="p-10 text-center border-2 border-dashed border-st-charcoal/10 rounded-[2rem]">
                   <p className="text-[10px] font-black uppercase tracking-widest text-st-charcoal/40">No records found</p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Center Panel: Activities Section */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-12">
             <div>
               <h2 className="text-5xl font-black uppercase tracking-tighter text-st-charcoal">
                 Day <span className="text-st-accent">{currentDay ? String(currentDay.day).padStart(2, '0') : '--'}</span>
               </h2>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-st-charcoal/40 mt-2">Logistical Breakdown</p>
             </div>
             
             <div className="flex items-center gap-4">
               <button 
                onClick={() => setShowMapMobile(!showMapMobile)}
                className="lg:hidden p-4 bg-st-secondary text-st-charcoal rounded-2xl hover:bg-st-accent transition-colors">
                  <MapIcon size={20} />
               </button>
               <button 
                onClick={() => setIsAddActivityOpen(true)}
                disabled={!currentDay}
                className="flex items-center gap-3 bg-st-charcoal text-st-primary px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-st-accent hover:text-st-charcoal transition-all shadow-xl shadow-st-charcoal/10 disabled:opacity-50 disabled:cursor-not-allowed">
                 <Plus size={16} /> Add Event
               </button>
             </div>
          </div>

          <div className="space-y-6">
            {currentDay?.activities?.length > 0 ? (
              [...currentDay.activities].sort((a,b) => a.time.localeCompare(b.time)).map((activity, idx) => (
                <div 
                  key={idx} 
                  className="group relative bg-white rounded-[2.5rem] p-8 flex flex-col md:flex-row md:items-center gap-8 hover:shadow-2xl hover:shadow-st-charcoal/5 transition-all duration-700 animate-in fade-in slide-in-from-bottom-6 duration-700 border border-st-charcoal/5 overflow-hidden"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-st-accent scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500"></div>
                  
                  <div className="flex items-center gap-6 md:w-32 flex-shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-st-secondary flex items-center justify-center text-st-charcoal group-hover:bg-st-accent transition-colors duration-500">
                        <Clock size={20} />
                    </div>
                    <div className="text-left">
                        <div className="text-xl font-black tracking-tighter text-st-charcoal">{activity.time}</div>
                        <div className="text-[9px] font-black uppercase tracking-widest text-st-charcoal/30">Local Time</div>
                    </div>
                  </div>

                    <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-black uppercase tracking-tighter text-st-charcoal group-hover:text-st-accent transition-colors duration-500">{activity.title}</h3>
                      {activity.estimatedCost > 0 && (
                        <span className="bg-st-accent/10 border border-st-accent/20 text-st-accent text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest flex items-center gap-1">
                          Estimated: ${activity.estimatedCost}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1.5 text-st-charcoal/50 text-[10px] font-black uppercase tracking-widest">
                          <MapPin size={10} className="text-st-accent" /> {activity.location}
                        </div>
                    </div>
                  </div>
                  
                  {activity.notes && (
                    <div className="hidden md:block w-48 text-[10px] leading-relaxed text-st-charcoal/40 italic font-medium">
                      "{activity.notes}"
                    </div>
                  )}
                  
                  <div className="md:ml-auto flex items-center gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDeleteActivity(idx); }}
                      className="p-4 rounded-2xl bg-st-secondary/50 text-st-charcoal/30 hover:text-red-500 hover:bg-red-50 transition-all group/delete"
                      title="Delete Event"
                    >
                      <Trash2 size={16} className="group-hover/delete:scale-110 transition-transform" />
                    </button>
                    <button className="p-4 rounded-2xl bg-st-secondary/50 text-st-charcoal/30 hover:text-st-accent transition-all cursor-grab active:cursor-grabbing">
                      <GripVertical size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-st-charcoal/10">
                 <Sparkles className="w-16 h-16 text-st-charcoal/10 mx-auto mb-6" />
                 <h3 className="text-2xl font-black uppercase tracking-tighter text-st-charcoal opacity-40">Clean Slate</h3>
                 <p className="text-[10px] font-black uppercase tracking-widest text-st-charcoal/20 mt-2">Initialize your itinerary above</p>
              </div>
            )}
          </div>
        </main>

        {/* Right Panel: Geographic Ledger Map */}
        <aside className={`${showMapMobile ? 'fixed inset-0 z-50 p-4 md:p-10 bg-st-primary' : 'hidden lg:block'} lg:w-[450px] flex-shrink-0`}>
          <div className={`${showMapMobile ? 'h-full w-full' : 'sticky top-60 h-[700px]'} bg-st-secondary rounded-[3.5rem] overflow-hidden border border-st-charcoal/5 shadow-inner relative`}>
             {showMapMobile && (
               <button 
                onClick={() => setShowMapMobile(false)}
                className="absolute top-8 right-8 z-[500] w-12 h-12 bg-st-charcoal text-st-primary rounded-full flex items-center justify-center hover:bg-st-accent hover:text-st-charcoal transition-all">
                 <X size={24} />
               </button>
             )}
             <TripMap trip={trip} currentDay={currentDay} />
          </div>
        </aside>
      </div>

      {/* Add Day Modal */}
      {isAddDayOpen && (
        <div className="fixed inset-0 bg-st-charcoal/80 backdrop-blur-xl flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-[3rem] w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-12 py-10 border-b border-st-charcoal/5 flex justify-between items-center">
              <h3 className="text-3xl font-black uppercase tracking-tighter text-st-charcoal">Expand Timeline</h3>
              <button onClick={() => setIsAddDayOpen(false)} className="w-12 h-12 rounded-2xl bg-st-secondary flex items-center justify-center text-st-charcoal hover:bg-red-50 hover:text-red-500 transition-all">
                <X size={20} />
              </button>
            </div>
            <form className="p-12 space-y-8" onSubmit={handleAddDay}>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-st-charcoal/40 mb-3 ml-1">Calendar Date</label>
                <input type="date" name="date" required className="w-full bg-st-secondary border-none rounded-2xl py-5 px-6 focus:ring-4 focus:ring-st-accent/10 font-bold transition-all" />
              </div>
              <div className="pt-4 flex gap-6">
                <button type="submit" disabled={isSaving} className="w-full py-5 bg-st-charcoal text-st-primary rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-st-accent hover:text-st-charcoal transition-all shadow-xl shadow-st-charcoal/20 flex items-center justify-center gap-3">
                  {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Sparkles size={14} />} Finalize Day
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Activity Modal */}
      {isAddActivityOpen && (
        <div className="fixed inset-0 bg-st-charcoal/80 backdrop-blur-xl flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-[3rem] w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-12 py-10 border-b border-st-charcoal/5 flex justify-between items-center">
              <h3 className="text-3xl font-black uppercase tracking-tighter text-st-charcoal">Append Event</h3>
              <button onClick={() => setIsAddActivityOpen(false)} className="w-12 h-12 rounded-2xl bg-st-secondary flex items-center justify-center text-st-charcoal hover:bg-red-50 hover:text-red-500 transition-all">
                <X size={20} />
              </button>
            </div>
            <form className="p-12 space-y-8" onSubmit={handleAddActivity}>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-st-charcoal/40 mb-3 ml-1">Event Handle</label>
                <input type="text" name="title" required placeholder="E.G. SEASIDE APERTIVO" className="w-full bg-st-secondary border-none rounded-2xl py-5 px-6 focus:ring-4 focus:ring-st-accent/10 font-bold transition-all text-sm uppercase" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-st-charcoal/40 mb-3 ml-1">Timestamp</label>
                  <input type="time" name="time" required className="w-full bg-st-secondary border-none rounded-2xl py-5 px-6 focus:ring-4 focus:ring-st-accent/10 font-bold transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-st-charcoal/40 mb-3 ml-1">Location</label>
                  <input type="text" name="location" placeholder="LOCATION" className="w-full bg-st-secondary border-none rounded-2xl py-5 px-6 focus:ring-4 focus:ring-st-accent/10 font-bold transition-all text-sm uppercase" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-st-charcoal/40 mb-3 ml-1">Estimated Cost ($)</label>
                <input type="number" name="estimatedCost" step="0.01" placeholder="0.00" className="w-full bg-st-secondary border-none rounded-2xl py-5 px-6 focus:ring-4 focus:ring-st-accent/10 font-bold transition-all text-sm uppercase" />
              </div>
              <div className="pt-4">
                <button type="submit" disabled={isSaving} className="w-full py-5 bg-st-charcoal text-st-primary rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-st-accent hover:text-st-charcoal transition-all shadow-xl shadow-st-charcoal/20 flex items-center justify-center gap-3">
                   {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : <Sparkles size={14} />} Confirm Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripDetail;
