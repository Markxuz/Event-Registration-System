import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, Link } from 'react-router-dom'; // <--- 1. Import useSearchParams

export default function RegistrationForm() {
  const [events, setEvents] = useState([]);
  const [searchParams] = useSearchParams(); // <--- 2. Initialize hook
  
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '', phone: '', organization_or_school: '', 
    event_id: '' 
  });
  const [status, setStatus] = useState({ message: '', type: '' });

  useEffect(() => {
    axios.get('http://localhost:3000/api/events')
      .then(res => {
        setEvents(res.data);
        // 3. Auto-select event if ID is in URL
        const urlEventId = searchParams.get('event_id');
        if (urlEventId) {
          setFormData(prev => ({ ...prev, event_id: urlEventId }));
        }
      })
      .catch(err => console.error(err));
  }, [searchParams]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.event_id) {
      setStatus({ message: 'Please select an event.', type: 'error' });
      return;
    }
    setStatus({ message: 'Processing...', type: 'loading' });
    try {
      const participantRes = await axios.post('http://localhost:3000/api/participants/register', {
        first_name: formData.first_name, last_name: formData.last_name, email: formData.email, phone: formData.phone, organization_or_school: formData.organization_or_school
      });
      const newParticipantId = participantRes.data.data.participant_id;
      await axios.post('http://localhost:3000/api/registrations', {
        participant_id: newParticipantId, event_id: formData.event_id
      });
      setStatus({ message: 'Registration Successful!', type: 'success' });
      setFormData({ first_name: '', last_name: '', email: '', phone: '', organization_or_school: '', event_id: '' });
    } catch (error) {
      setStatus({ message: error.response?.data?.message || 'Registration failed.', type: 'error' });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-100 p-6">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 p-8 text-center relative">
          
          <Link to="/" className="absolute left-6 top-6 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold py-2 px-4 rounded-lg transition flex items-center gap-2 shadow-sm border border-slate-700 hover:border-slate-600">
             Back
          </Link>

          <h2 className="text-2xl font-bold text-white tracking-wide">Event Registration</h2>
          <p className="text-slate-400 mt-2 text-sm">Join us! Fill in your details below.</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Select Event</label>
              <div className="relative">
                <select name="event_id" value={formData.event_id} onChange={handleChange} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition text-slate-700">
                  <option value="">-- Choose an Event --</option>
                  {events.map(event => !event.is_archived && (
                    <option key={event.event_id} value={event.event_id}>{event.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">First Name</label>
                <input type="text" name="first_name" required value={formData.first_name} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Last Name</label>
                <input type="text" name="last_name" required value={formData.last_name} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition" />
              </div>
            </div>
            
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition" />
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition" />
            </div>
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Organization / School</label>
                <input type="text" name="organization_or_school" value={formData.organization_or_school} onChange={handleChange} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none transition" />
            </div>

            <button type="submit" className="w-full bg-blue-700 text-white p-4 rounded-lg font-bold hover:bg-blue-800 transition shadow-md">
              Confirm Registration
            </button>
          </form>

          {status.message && (
            <div className={`mt-6 p-4 rounded-lg flex items-center gap-3 text-sm font-bold border ${
              status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
              status.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200'
            }`}>
              {status.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}