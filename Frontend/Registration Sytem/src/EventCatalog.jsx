import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function EventCatalog() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/events')
      .then(res => setEvents(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF8D4] font-sans text-[#313647]">
      
      {/* Hero Section */}
      <div className="bg-[#313647] py-16 text-center shadow-lg relative overflow-hidden">
        {/* Abstract decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0 100 C 20 0 50 0 100 100 Z" fill="#435663" />
           </svg>
        </div>
        
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Upcoming Events</h1>
          <p className="text-[#FFF8D4] text-lg opacity-90">Browse our scheduled seminars and workshops.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events
            .filter(event => !event.is_archived)
            .map(event => (
            <div key={event.event_id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-[#435663]/10 overflow-hidden flex flex-col transform hover:-translate-y-1">
              
              <div className="h-2 bg-[#435663] w-full"></div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-[#FFF8D4] text-[#313647] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-[#313647]/10">
                    Open
                  </span>
                  <span className="text-[#435663] text-xs font-bold flex items-center gap-1">
                    {/* User Icon SVG */}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    {event.capacity} Slots
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#313647] mb-3">{event.name}</h3>
                
                <div className="text-sm text-[#435663] mb-6 space-y-3">
                  <p className="flex items-center gap-3">
                    {/* Calendar Icon SVG */}
                    <svg className="w-5 h-5 text-[#313647]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span className="font-medium">{new Date(event.event_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </p>
                  <p className="flex items-center gap-3">
                    {/* Map Pin Icon SVG */}
                    <svg className="w-5 h-5 text-[#313647]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {event.venue}
                  </p>
                </div>

                <p className="text-[#435663]/80 text-sm mb-6 line-clamp-3 leading-relaxed border-t border-gray-100 pt-4">
                  {event.description || "No description provided."}
                </p>

                <div className="mt-auto">
                  <Link 
                    to={`/register?event_id=${event.event_id}`} 
                    className="flex items-center justify-center gap-2 w-full bg-[#313647] text-white py-3 rounded-lg font-bold hover:bg-[#435663] transition shadow-md"
                  >
                    Register Now 
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-20 text-[#435663]">
            <p className="text-xl font-medium">No events available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}