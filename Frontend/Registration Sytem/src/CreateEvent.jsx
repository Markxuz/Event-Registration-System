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
    <div className="flex justify-center items-center min-h-screen bg-[#FFF8D4] p-6 font-sans">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-2xl overflow-hidden border border-[#313647]/10">
        
        <div className="bg-[#313647] p-8 text-center relative">
          <Link to="/admin" className="absolute top-5 right-5 text-[#FFF8D4] hover:text-white transition p-2" title="Cancel">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </Link>

          <h2 className="text-2xl font-bold text-white tracking-wide">Create New Event</h2>
          <p className="text-[#FFF8D4]/80 mt-2 text-sm">Enter the details for the new event below.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-xs font-bold text-[#435663] uppercase mb-1">Event Name</label>
            <input type="text" name="name" required onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#313647] outline-none transition" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#435663] uppercase mb-1">Date</label>
              <input type="date" name="event_date" required onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#313647] outline-none transition" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#435663] uppercase mb-1">Capacity</label>
              <input type="number" name="capacity" required onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#313647] outline-none transition" placeholder="Max. 100" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#435663] uppercase mb-1">Venue</label>
            <input type="text" name="venue" required onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#313647] outline-none transition" />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#435663] uppercase mb-1">Description</label>
            <textarea name="description" onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#313647] outline-none transition h-24 resize-none" placeholder="Add a short description..."></textarea>
          </div>
          
          <button type="submit" className="w-full bg-[#313647] text-white p-4 rounded-lg font-bold hover:bg-[#435663] transition shadow-md mt-2">
            Publish Event
          </button>
        </form>
      </div>
    </div>
  );
}