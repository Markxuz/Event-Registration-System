import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({ total: 0, paid: 0, present: 0 });
  
  // Modal State
  const [selectedEvent, setSelectedEvent] = useState(null); // Stores the event currently being viewed
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/registrations/dashboard');
      setRegistrations(res.data);
      calculateStats(res.data);
      const eventRes = await axios.get('http://localhost:3000/api/events');
      setEvents(eventRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const calculateStats = (data) => {
    const paid = data.filter(r => r.Payment?.payment_status === 'Paid').length;
    const present = data.filter(r => r.attendance_status === 'Present').length;
    setStats({ total: data.length, paid, present });
  };

  useEffect(() => { fetchData(); }, []);

  // Filter participants for the selected event
  const eventParticipants = selectedEvent 
    ? registrations.filter(r => r.event_id === selectedEvent.event_id)
    : [];

  const togglePayment = async (regId, currentStatus) => {
    const newStatus = currentStatus === 'Paid' ? 'Pending' : 'Paid';
    await axios.put(`http://localhost:3000/api/registrations/${regId}/payment`, { status: newStatus });
    fetchData(); // Refresh data behind the scenes
  };

  const toggleAttendance = async (regId, currentStatus) => {
    const newStatus = currentStatus === 'Present' ? 'Registered' : 'Present';
    await axios.put(`http://localhost:3000/api/registrations/${regId}/attendance`, { status: newStatus });
    fetchData();
  };

  const handleArchive = async (e, eventId) => {
    e.stopPropagation(); // Prevent opening modal when clicking archive
    if (!window.confirm("Archive this event?")) return;
    try {
      await axios.put(`http://localhost:3000/api/events/${eventId}/archive`);
      fetchData();
    } catch (error) {
      alert("Error archiving");
    }
  };

  const openModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 relative">
      
      {/* Navbar */}
      <nav className="bg-slate-900 shadow-md text-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-wide"><span className="text-slate-400 font-normal">| Admin</span></h1>
          </div>
          <div className="flex gap-3">
            <Link to="/print-report" target="_blank" className="text-slate-300 hover:text-white px-4 py-2 text-sm font-medium flex items-center gap-2 transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg> 
              Generate Report
            </Link>
            <Link to="/create-event" className="bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-blue-600 transition flex items-center gap-2 shadow-sm">
              + New Event
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Registrations', val: stats.total, color: 'blue', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
            { label: 'Payments Collected', val: stats.paid, color: 'emerald', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
            { label: 'Confirmed Attendance', val: stats.present, color: 'violet', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg border border-slate-200 p-6 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{item.val}</p>
              </div>
              <div className={`p-3 rounded-full bg-${item.color}-50 text-${item.color}-600`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path></svg>
              </div>
            </div>
          ))}
        </div>

        {/* --- MAIN EVENT LIST --- */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h2 className="font-bold text-slate-700 text-lg">Active Events</h2>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Select an event to view participants</span>
          </div>
          <table className="w-full text-left">
            <thead className="bg-white border-b border-slate-200">
              <tr>
                <th className="p-5 text-xs font-bold text-slate-500 uppercase">Event Name</th>
                <th className="p-5 text-xs font-bold text-slate-500 uppercase">Schedule</th>
                <th className="p-5 text-xs font-bold text-slate-500 uppercase">Capacity</th>
                <th className="p-5 text-xs font-bold text-slate-500 uppercase text-center">Registrants</th>
                <th className="p-5 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events.filter(e => !e.is_archived).map(event => {
                // Calculate count for this event
                const count = registrations.filter(r => r.event_id === event.event_id).length;
                
                return (
                  <tr key={event.event_id} onClick={() => openModal(event)} className="hover:bg-blue-50 transition cursor-pointer group">
                    <td className="p-5 font-bold text-slate-900 group-hover:text-blue-700">{event.name}</td>
                    <td className="p-5 text-sm text-slate-600">
                      📅 {new Date(event.event_date).toLocaleDateString()}
                    </td>
                    <td className="p-5 text-sm text-slate-600">{event.capacity} pax</td>
                    <td className="p-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${count >= event.capacity ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                        {count} Registered
                      </span>
                    </td>
                    <td className="p-5 text-right flex justify-end gap-3">
                      <button className="text-blue-600 hover:text-blue-800 text-xs font-bold bg-blue-50 px-3 py-1.5 rounded-lg transition border border-blue-100">
                        View List
                      </button>
                      <button onClick={(e) => handleArchive(e, event.event_id)} className="text-slate-400 hover:text-red-600 text-xs font-bold px-2 transition">
                        Archive
                      </button>
                    </td>
                  </tr>
                );
              })}
              {events.filter(e => !e.is_archived).length === 0 && <tr><td colSpan="5" className="p-10 text-center text-gray-400">No active events.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- PARTICIPANT MODAL --- */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fadeIn">
            
            {/* Modal Header */}
            <div className="bg-slate-900 p-6 flex justify-between items-center text-white shrink-0">
              <div>
                <h2 className="text-2xl font-bold">{selectedEvent.name}</h2>
                <div className="flex gap-4 text-slate-400 text-sm mt-1">
                  <span>📍 {selectedEvent.venue}</span>
                  <span>📅 {new Date(selectedEvent.event_date).toLocaleDateString()}</span>
                </div>
              </div>
              <button onClick={closeModal} className="text-slate-400 hover:text-white transition text-2xl font-bold bg-slate-800 w-10 h-10 rounded-full flex items-center justify-center">
                ✕
              </button>
            </div>

            {/* Modal Table Body (Scrollable) */}
            <div className="overflow-y-auto p-6 bg-slate-50">
              <table className="w-full text-left border-collapse bg-white rounded-lg shadow-sm overflow-hidden">
                <thead className="bg-slate-100 border-b border-slate-200">
                  <tr>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase sticky top-0">Participant</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase sticky top-0">Organization</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center sticky top-0">Payment</th>
                    <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center sticky top-0">Attendance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {eventParticipants.length > 0 ? (
                    eventParticipants.map((reg) => (
                      <tr key={reg.registration_id} className="hover:bg-slate-50 transition">
                        <td className="p-4">
                          <div className="font-bold text-slate-900 text-sm">{reg.Participant?.last_name}, {reg.Participant?.first_name}</div>
                          <div className="text-xs text-slate-500">{reg.Participant?.email}</div>
                        </td>
                        <td className="p-4 text-sm text-slate-600">
                          {reg.Participant?.organization_or_school}
                        </td>
                        <td className="p-4 text-center">
                          <button onClick={() => togglePayment(reg.registration_id, reg.Payment?.payment_status)}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition border w-24 ${
                              reg.Payment?.payment_status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                            }`}>
                            {reg.Payment?.payment_status || 'Pending'}
                          </button>
                        </td>
                        <td className="p-4 text-center">
                          <button onClick={() => toggleAttendance(reg.registration_id, reg.attendance_status)}
                            className={`px-3 py-1 rounded-md text-xs font-bold border transition w-28 ${
                              reg.attendance_status === 'Present' ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-500 border-slate-300 hover:border-slate-400'
                            }`}>
                            {reg.attendance_status === 'Present' ? '✔ Present' : 'Mark Present'}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-12 text-center text-slate-400 italic">No participants have registered for this event yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-slate-200 shrink-0 flex justify-end">
              <button onClick={closeModal} className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-2 rounded-lg font-bold transition">
                Close List
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}