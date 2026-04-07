import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, Map as MapIcon, Loader2, Sparkles, X } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../utils/api';

const customIcon = L.divIcon({
  className: 'custom-pin',
  html: `<div style="background-color: #2563EB; width: 24px; height: 24px; border-radius: 50%; border: 4px solid white; box-shadow: 0px 4px 15px rgba(37, 99, 235, 0.4);"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

L.Marker.prototype.options.icon = customIcon;

const CreateTrip = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    currency: 'USD'
  });

  const [showMap, setShowMap] = useState(false);
  const [mapLoading, setMapLoading] = useState(false);
  const [position, setPosition] = useState(null);

  const fetchLocationName = async (lat, lng) => {
    setMapLoading(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
      const data = await response.json();
      
      const city = data.address.city || data.address.town || data.address.village || '';
      const country = data.address.country || '';
      const name = data.name || '';
      
      let formattedAddress = name;
      if (city && name !== city) formattedAddress += `, ${city}`;
      if (country) formattedAddress += `, ${country}`;
      
      setFormData(prev => ({ ...prev, destination: formattedAddress || data.display_name }));
    } catch (error) {
      console.error("Geocoding failed", error);
    } finally {
      setMapLoading(false);
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        fetchLocationName(e.latlng.lat, e.latlng.lng);
      },
    });
    return position === null ? null : (
      <Marker position={position}></Marker>
    )
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/trips', {
        ...formData,
        budget: Number(formData.budget)
      });
      navigate(`/trips/${data._id}`);
    } catch (err) {
      console.error('Error creating trip:', err);
      alert('Failed to create trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-st-primary min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-3 mb-4">
             <Sparkles size={20} className="text-st-accent" />
             <span className="text-st-accent text-[10px] font-black uppercase tracking-[0.4em]">Curation Suite</span>
          </div>
          <h1 className="text-6xl font-black uppercase tracking-tighter text-st-charcoal leading-none">
             Designer <br /> <span className="text-st-accent">Itinerary</span>
          </h1>
        </div>

        <div className="bg-white rounded-[3rem] shadow-2xl shadow-st-charcoal/5 border border-st-charcoal/5 overflow-hidden animate-in fade-in zoom-in-95 duration-1000">
          <form onSubmit={handleSubmit} className="p-8 md:p-14 space-y-12">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="md:col-span-2 group">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-st-charcoal/40 mb-4 ml-1 group-focus-within:text-st-accent transition-colors">Manifest Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="block w-full text-4xl font-black uppercase tracking-tighter border-none bg-st-secondary/30 rounded-3xl py-8 px-8 focus:ring-4 focus:ring-st-accent/10 focus:bg-white text-st-charcoal placeholder-st-charcoal/10 transition-all outline-none"
                  placeholder="E.G. AMALFI ESCAPE"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-st-charcoal/40 mb-4 ml-1">Landing Coordinates</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-st-accent" />
                  </div>
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    required
                    className="pl-16 pr-40 block w-full bg-st-secondary/50 border-none rounded-[2rem] py-6 focus:ring-4 focus:ring-st-accent/10 focus:bg-white text-st-charcoal placeholder-st-charcoal/20 transition-all font-bold"
                    placeholder="Select on Map or Type..."
                    readOnly={mapLoading}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowMap(!showMap)}
                    className="absolute inset-y-3 right-3 px-8 bg-st-charcoal hover:bg-st-accent text-st-primary hover:text-st-charcoal rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all duration-500"
                  >
                    {showMap ? <X size={14} /> : <MapIcon size={14} />}
                    {showMap ? 'Lock' : 'Geo-Picker'}
                  </button>
                </div>
                
                {showMap && (
                  <div className="mt-8 border-4 border-st-secondary rounded-[2.5rem] overflow-hidden relative shadow-inner animate-in fade-in slide-in-from-top-4 duration-700" style={{ height: '400px' }}>
                    {mapLoading && (
                       <div className="absolute inset-0 bg-st-primary/60 z-[400] flex items-center justify-center backdrop-blur-sm">
                          <Loader2 className="w-12 h-12 text-st-accent animate-spin" />
                       </div>
                    )}
                    <MapContainer center={[20, 0]} zoom={2} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                      />
                      <LocationMarker />
                    </MapContainer>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-st-charcoal/40 ml-1">Arrival</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-st-charcoal/30" />
                  </div>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="pl-16 block w-full bg-st-secondary/50 border-none rounded-[1.5rem] py-5 focus:ring-4 focus:ring-st-accent/10 text-st-charcoal font-bold transition-all"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-st-charcoal/40 ml-1">Departure</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-st-charcoal/30" />
                  </div>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                    className="pl-16 block w-full bg-st-secondary/50 border-none rounded-[1.5rem] py-5 focus:ring-4 focus:ring-st-accent/10 text-st-charcoal font-bold transition-all"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-st-charcoal/40 ml-1">Target Investment</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                    <DollarSign className="h-4 w-4 text-st-charcoal/30" />
                  </div>
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="pl-16 block w-full bg-st-secondary/50 border-none rounded-[1.5rem] py-5 focus:ring-4 focus:ring-st-accent/10 text-st-charcoal font-bold transition-all"
                    placeholder="25000"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-st-charcoal/40 ml-1">Currency</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="block w-full bg-st-secondary/50 border-none rounded-[1.5rem] py-5 px-6 focus:ring-4 focus:ring-st-accent/10 text-st-charcoal font-bold appearance-none transition-all cursor-pointer"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="INR">INR - Indian Rupee</option>
                </select>
              </div>
            </div>

            <div className="pt-12 flex flex-col md:flex-row justify-end gap-6 border-t border-st-charcoal/5">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-widest text-st-charcoal/40 hover:text-st-charcoal transition-colors"
              >
                Discard Draft
              </button>
              <button
                type="submit"
                disabled={loading}
                className="group relative px-12 py-5 bg-st-accent text-st-charcoal rounded-full overflow-hidden transition-all duration-500 shadow-xl shadow-st-accent/20 disabled:opacity-70"
              >
                 <div className="absolute inset-0 bg-st-charcoal translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                 <div className="relative z-10 flex items-center justify-center gap-3">
                   {loading ? <Loader2 className="w-4 h-4 animate-spin text-st-charcoal group-hover:text-st-primary" /> : <Sparkles size={16} className="text-st-charcoal group-hover:text-st-primary" />}
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] group-hover:text-st-primary">Finalize Plan</span>
                 </div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTrip;
