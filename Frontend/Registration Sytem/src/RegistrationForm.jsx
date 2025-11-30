import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, Link } from 'react-router-dom';

export default function RegistrationForm() {
  const [events, setEvents] = useState([]);
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '', phone: '', organization_or_school: '', 
    event_id: '' 
  });
  const [status, setStatus] = useState({ message: '', type: '' });

  useEffect(() => {
    axios.get('http://localhost:3000/api/events')
      .then(res => {
        setEvents(res.data);
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
    <div className="flex justify-center items-center min-h-screen bg-[#FFF8D4] p-6 font-sans">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden border border-[#313647]/10">
        
        {/* Header */}
        <div className="bg-[#313647] p-8 text-center relative">
          <Link to="/" className="absolute left-6 top-6 bg-[#435663] hover:bg-[#566b7a] text-white text-xs font-bold py-2 px-4 rounded-lg transition flex items-center gap-2 shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back
          </Link>

          <h2 className="text-2xl font-bold text-white tracking-wide mt-2">Event Registration</h2>
          <p className="text-[#FFF8D4]/80 mt-2 text-sm">Join us! Fill in your details below.</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#435663] uppercase tracking-wider mb-2">Select Event</label>
              <div className="relative">
                <select name="event_id" value={formData.event_id} onChange={handleChange} required className="w-full p-3 bg-[#FFF8D4]/30 border border-[#435663]/30 rounded-lg focus:ring-2 focus:ring-[#313647] focus:border-transparent outline-none transition text-[#313647] font-medium">
                  <option value="">-- Choose an Event --</option>
                  {events.map(event => !event.is_archived && (
                    <option key={event.event_id} value={event.event_id}>{event.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#435663] uppercase mb-1">First Name</label>
                <input type="text" name="first_name" required value={formData.first_name} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#313647] outline-none transition" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#435663] uppercase mb-1">Last Name</label>
                <input type="text" name="last_name" required value={formData.last_name} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#313647] outline-none transition" />
              </div>
            </div>
            
            <div>
                <label className="block text-xs font-bold text-[#435663] uppercase mb-1">Email</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#313647] outline-none transition" />
            </div>
            <div>
                <label className="block text-xs font-bold text-[#435663] uppercase mb-1">Phone</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#313647] outline-none transition" />
            </div>
            <div>
                <label className="block text-xs font-bold text-[#435663] uppercase mb-1">Organization / School</label>
                <input type="text" name="organization_or_school" value={formData.organization_or_school} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#313647] outline-none transition" />
            </div>

            <button type="submit" className="w-full bg-[#313647] text-white p-4 rounded-lg font-bold hover:bg-[#435663] transition shadow-lg mt-4">
              Confirm Registration
            </button>
          </form>

          {status.message && (
            <div className={`mt-6 p-4 rounded-lg flex items-center gap-3 text-sm font-bold border ${
              status.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 
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