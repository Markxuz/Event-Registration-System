import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', description: '', venue: '', event_date: '', capacity: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await axios.post('http://localhost:3000/api/events/create', formData); navigate('/admin'); } 
    catch (error) { alert('Error creating event'); }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-500 p-6">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
        
        <div className="bg-slate-900 p-8 text-center relative">
          {/* Cancel Button (Top Right) */}
          <Link to="/admin" className="absolute top-5 right-5 text-slate-500 hover:text-white transition text-xl font-bold" title="Cancel">
            ✕
          </Link>

          <h2 className="text-2xl font-bold text-white tracking-wide">Create New Event</h2>
          <p className="text-slate-400 mt-2 text-sm">Enter the details for the new event below.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Event Name</label>
            <input type="text" name="name" required onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition" placeholder="" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date</label>
              <input type="date" name="event_date" required onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Capacity</label>
              <input type="number" name="capacity" required onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition" placeholder="Max. 100" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Venue</label>
            <input type="text" name="venue" required onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition" placeholder="" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
            <textarea name="description" onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition h-24 resize-none" placeholder=""></textarea>
          </div>
          
          <button type="submit" className="w-full bg-blue-700 text-white p-4 rounded-lg font-bold hover:bg-blue-800 transition shadow-md mt-2">
            Publish Event
          </button>
        </form>
      </div>
    </div>
  );
}