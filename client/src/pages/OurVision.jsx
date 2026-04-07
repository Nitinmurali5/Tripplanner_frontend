import { useEffect } from 'react';

const OurVision = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-st-primary pt-24 pb-20">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-32">
        <h1 className="text-[12vw] leading-[0.85] font-black uppercase tracking-tighter text-st-charcoal mb-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          The Future <br /> of Luxury <br /> <span className="text-st-accent">Travel</span>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
          <div className="md:col-span-5">
            <p className="text-xl text-st-charcoal font-medium leading-relaxed">
              Super Travel isn't just an itinerary planner; it’s an editorial lens through which you experience the world. We believe travel should be immersive, effortless, and aesthetically profound.
            </p>
          </div>
          <div className="md:col-span-7">
            <div className="aspect-[16/9] bg-st-secondary overflow-hidden rounded-2xl grayscale hover:grayscale-0 transition-all duration-1000 cursor-pointer group">
              <img 
                src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=2000" 
                alt="Travel Vision"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto Section */}
      <section className="bg-st-charcoal py-32 text-st-primary overflow-hidden">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
            <div className="relative">
              <span className="text-[200px] font-black text-st-primary/5 absolute -top-24 -left-12 leading-none select-none">01</span>
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-8 relative z-10">Curation Over <br /> Chaos</h2>
              <p className="text-st-primary/70 text-lg leading-relaxed mb-8">
                The modern traveler is overwhelmed by options. We strip away the noise, presenting only the most exquisite destinations and experiences curated by our global network of experts.
              </p>
              <div className="h-[1px] w-24 bg-st-accent"></div>
            </div>
            <div className="relative group overflow-hidden rounded-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1506929113675-80af19266e54?auto=format&fit=crop&q=80&w=1000"
                  alt="Curated Experience"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 mt-48">
             <div className="md:order-2">
                <span className="text-[200px] font-black text-st-primary/5 absolute -top-24 -right-12 leading-none select-none">02</span>
                <h2 className="text-4xl font-black uppercase tracking-tighter mb-8 relative z-10">Seamless <br /> Connection</h2>
                <p className="text-st-primary/70 text-lg leading-relaxed mb-8">
                  Technology should disappear. Our tools are designed to work in the background, keeping you present in the moment while we handle the intricate logistics of your journey.
                </p>
                <div className="h-[1px] w-24 bg-st-accent"></div>
            </div>
            <div className="relative group overflow-hidden rounded-2xl md:order-1">
                <img 
                  src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1000"
                  alt="Seamless Travel"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
            </div>
          </div>
        </div>
      </section>

      {/* Footer Quote */}
      <section className="py-48 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <blockquote className="text-5xl md:text-7xl font-black uppercase tracking-[calc(-0.05em)] text-st-charcoal leading-[0.9]">
          "Travel is the only <span className="text-st-accent italic underline decoration-4 underline-offset-8">luxury</span> that leaves you richer."
        </blockquote>
      </section>
    </div>
  );
};

export default OurVision;
