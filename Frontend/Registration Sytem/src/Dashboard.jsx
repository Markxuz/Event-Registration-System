import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({ total: 0, paid: 0, present: 0 });
  const [activeTab, setActiveTab] = useState('registrations');
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredRegistrations = registrations.filter(reg => {
    const search = searchTerm.toLowerCase();
    const name = `${reg.Participant?.first_name} ${reg.Participant?.last_name}`.toLowerCase();
    const email = reg.Participant?.email?.toLowerCase() || '';
    const event = reg.Event?.name?.toLowerCase() || '';
    return name.includes(search) || email.includes(search) || event.includes(search);
  });

  const togglePayment = async (regId, currentStatus) => {
    const newStatus = currentStatus === 'Paid' ? 'Pending' : 'Paid';
    await axios.put(`http://localhost:3000/api/registrations/${regId}/payment`, { status: newStatus });
    fetchData();
  };

  const toggleAttendance = async (regId, currentStatus) => {
    const newStatus = currentStatus === 'Present' ? 'Registered' : 'Present';
    await axios.put(`http://localhost:3000/api/registrations/${regId}/attendance`, { status: newStatus });
    fetchData();
  };

  const handleArchive = async (eventId) => {
    if (!window.confirm("Archive this event?")) return;
    try { await axios.put(`http://localhost:3000/api/events/${eventId}/archive`); fetchData(); } 
    catch (error) { alert("Error archiving"); }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
            <h1 className="text-xl font-bold text-slate-800">Admin Console</h1>
          </div>
          <div className="flex gap-3">
            <Link to="/print-report" target="_blank" className="text-slate-600 hover:text-slate-900 px-4 py-2 text-sm font-medium flex items-center gap-2 transition">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
              Generate Report
            </Link>
            <Link to="/create-event" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-blue-700 transition flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              New Event
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Registrations', value: stats.total, icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />, color: 'blue' },
            { label: 'Payments Verified', value: stats.paid, icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />, color: 'emerald' },
            { label: 'Confirmed Attendance', value: stats.present, icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />, color: 'violet' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-800 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-${stat.color}-50 text-${stat.color}-600`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">{stat.icon}</svg>
              </div>
            </div>
          ))}
        </div>

        {/* Filters & Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
            <button onClick={() => setActiveTab('registrations')} className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === 'registrations' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Participants</button>
            <button onClick={() => setActiveTab('events')} className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === 'events' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}>Events</button>
          </div>

          {activeTab === 'registrations' && (
            <div className="relative w-full md:w-80">
              <input type="text" placeholder="Search records..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
              <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
          )}
        </div>

        {/* Table Area */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          
          {activeTab === 'registrations' && (
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Participant</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Event Context</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-center">Payment</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRegistrations.map((reg) => (
                  <tr key={reg.registration_id} className="hover:bg-slate-50 transition">
                    <td className="p-4">
                      <div className="font-medium text-slate-900">{reg.Participant?.first_name} {reg.Participant?.last_name}</div>
                      <div className="text-xs text-slate-500">{reg.Participant?.email}</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {reg.Event?.name}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button onClick={() => togglePayment(reg.registration_id, reg.Payment?.payment_status)}
                        className={`px-3 py-1 rounded-md text-xs font-semibold border transition ${
                          reg.Payment?.payment_status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                        }`}>
                        {reg.Payment?.payment_status || 'Pending'}
                      </button>
                    </td>
                    <td className="p-4 text-center">
                      <button onClick={() => toggleAttendance(reg.registration_id, reg.attendance_status)}
                        className={`px-3 py-1 rounded-md text-xs font-semibold border transition ${
                          reg.attendance_status === 'Present' ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}>
                        {reg.attendance_status === 'Present' ? 'Checked In' : 'Absent'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'events' && (
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Event Details</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Capacity</th>
                  <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.filter(e => !e.is_archived).map(event => (
                  <tr key={event.event_id} className="hover:bg-slate-50 transition">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{event.name}</div>
                      <div className="text-sm text-slate-500">{event.venue} • {new Date(event.event_date).toLocaleDateString()}</div>
                    </td>
                    <td className="p-4 text-sm text-slate-600">{event.capacity} Attendees</td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleArchive(event.event_id)} className="text-red-600 hover:text-red-800 text-xs font-medium hover:underline">
                        Archive
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}