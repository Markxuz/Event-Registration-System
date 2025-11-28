import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', description: '', venue: '', event_date: '', capacity: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/events/create', formData);
      navigate('/admin');
    } catch (error) {
      alert('Error creating event');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-100 p-4">
      <div className="w-full max-w-2xl bg-white p-10 rounded-2xl shadow-xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-gray-800">Create New Event</h2>
          <Link to="/admin" className="text-sm font-bold text-gray-400 hover:text-gray-600">✕ Cancel</Link>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Event Name</label>
            <input type="text" name="name" required onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="e.g. Annual Code Camp" />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date</label>
              <input type="date" name="event_date" required onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Capacity</label>
              <input type="number" name="capacity" required onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="e.g. 100" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Venue</label>
            <input type="text" name="venue" required onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition" placeholder="e.g. Grand Hall" />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
            <textarea name="description" onChange={handleChange} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition h-32" placeholder="Event details..."></textarea>
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition shadow-lg mt-4">
             Publish Event
          </button>
        </form>
      </div>
    </div>
  );
}