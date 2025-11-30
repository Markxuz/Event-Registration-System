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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* Hero Section */}
      <div className="bg-slate-900 py-16 text-center shadow-lg">
        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Upcoming Events</h1>
        <p className="text-slate-400 text-lg">Browse our scheduled seminars and workshops.</p>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events
            .filter(event => !event.is_archived)
            .map(event => (
            <div key={event.event_id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-slate-200 overflow-hidden flex flex-col">
              
              {/* Card Header (Color Bar) */}
              <div className="h-3 bg-blue-600 w-full"></div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Open for Registration
                  </span>
                  <span className="text-slate-400 text-xs font-medium flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                    {event.capacity} Slots
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-2">{event.name}</h3>
                
                <div className="text-sm text-slate-500 mb-6 space-y-2">
                  <p className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {new Date(event.event_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {event.venue}
                  </p>
                </div>

                <p className="text-slate-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                  {event.description || "No description provided."}
                </p>

                {/* Push Button to Bottom */}
                <div className="mt-auto">
                  <Link 
                    to={`/register?event_id=${event.event_id}`} 
                    className="block w-full bg-slate-900 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
                  >
                    Register Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <p className="text-xl">No events available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}