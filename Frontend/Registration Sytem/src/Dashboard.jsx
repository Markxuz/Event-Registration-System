import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({ total: 0, paid: 0, present: 0 });
  const [searchTerm, setSearchTerm] = useState(''); 
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/registrations/dashboard');
      setRegistrations(res.data);
      calculateStats(res.data);
      const eventRes = await axios.get('http://localhost:3000/api/events');
      setEvents(eventRes.data);
    } catch (error) { console.error(error); }
  };

  const calculateStats = (data) => {
    const paid = data.filter(r => r.Payment?.payment_status === 'Paid').length;
    const present = data.filter(r => r.attendance_status === 'Present').length;
    setStats({ total: data.length, paid, present });
  };

  useEffect(() => { fetchData(); }, []);

  const filteredEvents = events.filter(event => 
    !event.is_archived && 
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const eventParticipants = selectedEvent 
    ? registrations.filter(r => {
        const isMatch = r.event_id === selectedEvent.event_id;
        const search = searchTerm.toLowerCase();
        const name = `${r.Participant?.first_name} ${r.Participant?.last_name}`.toLowerCase();
        const email = r.Participant?.email?.toLowerCase();
        return isMatch && (name.includes(search) || email.includes(search));
      })
    : [];

  const togglePayment = async (regId, currentStatus) => {
    await axios.put(`http://localhost:3000/api/registrations/${regId}/payment`, { status: currentStatus === 'Paid' ? 'Pending' : 'Paid' });
    fetchData();
  };

  const toggleAttendance = async (regId, currentStatus) => {
    await axios.put(`http://localhost:3000/api/registrations/${regId}/attendance`, { status: currentStatus === 'Present' ? 'Registered' : 'Present' });
    fetchData();
  };

  const handleArchive = async (e, id) => {
    e.stopPropagation();
    if (confirm("Archive this event?")) {
      await axios.put(`http://localhost:3000/api/events/${id}/archive`);
      fetchData();
    }
  };

  const handleRestore = async (id) => {
    if (confirm("Restore this event?")) {
      await axios.put(`http://localhost:3000/api/events/${id}/restore`);
      fetchData();
    }
  };

  const openModal = (event) => { setSearchTerm(''); setSelectedEvent(event); setIsModalOpen(true); };
  const closeModal = () => { setSearchTerm(''); setIsModalOpen(false); setSelectedEvent(null); };

  return (
    <div className="min-h-screen bg-[#FFF8D4] font-sans text-[#313647] relative">
      
      {/* Navbar */}
      <nav className="bg-[#313647] shadow-lg text-white sticky top-0 z-20 border-b border-[#435663]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-wide">Admin Dashboard</h1>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setIsArchiveModalOpen(true)} className="text-[#FFF8D4] hover:text-white px-4 py-2 text-sm font-bold transition flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
              Archives
            </button>

            <Link to="/print-report" target="_blank" className="text-[#FFF8D4] hover:text-white px-4 py-2 text-sm font-bold flex items-center gap-2 transition">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
               Print Report
            </Link>
            <Link to="/create-event" className="bg-[#435663] text-white px-4 py-2 rounded-md font-bold text-sm hover:bg-[#566b7a] transition shadow-md flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              Add New Event
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { 
              label: 'Total Registrations', 
              val: stats.total, 
              icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' 
            },
            { 
              label: 'Payments Collected', 
              val: stats.paid, 
              icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' 
            },
            { 
              label: 'Confirmed Attendance', 
              val: stats.present, 
              icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' 
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg border border-[#435663]/20 p-6 flex items-center justify-between shadow-sm hover:shadow-md transition">
              <div>
                <p className="text-xs font-bold text-[#435663] uppercase tracking-widest">{item.label}</p>
                <p className="text-3xl font-extrabold text-[#313647] mt-1">{item.val}</p>
              </div>
              {/* Fixed: Use the item.icon path and correct background opacity syntax */}
              <div className="p-3 rounded-full bg-[#313647]/10 text-[#313647]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* --- MAIN EVENT LIST --- */}
        <div className="bg-white border border-[#435663]/20 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#435663]/10 bg-white flex justify-between items-center">
            <h2 className="font-bold text-[#313647] text-lg">Active Events</h2>
            
            <div className="relative">
              <input type="text" placeholder="Search Events..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
                className="pl-10 pr-4 py-2 w-64 bg-[#FFF8D4]/30 border border-[#435663]/30 rounded-lg text-sm focus:ring-2 focus:ring-[#313647] outline-none text-[#313647]" />
              <svg className="w-4 h-4 text-[#435663] absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>

          <table className="w-full text-left">
            <thead className="bg-[#FFF8D4]/50 border-b border-[#435663]/10">
              <tr>
                <th className="p-5 text-xs font-bold text-[#435663] uppercase">Event Name</th>
                <th className="p-5 text-xs font-bold text-[#435663] uppercase">Schedule</th>
                <th className="p-5 text-xs font-bold text-[#435663] uppercase">Capacity</th>
                <th className="p-5 text-xs font-bold text-[#435663] uppercase text-center">Registrants</th>
                <th className="p-5 text-xs font-bold text-[#435663] uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#435663]/10">
              {filteredEvents.map(event => { 
                const count = registrations.filter(r => r.event_id === event.event_id).length;
                return (
                  <tr key={event.event_id} onClick={() => openModal(event)} className="hover:bg-[#FFF8D4]/30 transition cursor-pointer group">
                    <td className="p-5 font-bold text-[#313647] group-hover:text-[#435663]">{event.name}</td>
                    <td className="p-5 text-sm text-[#435663]"> {new Date(event.event_date).toLocaleDateString()}</td>
                    <td className="p-5 text-sm text-[#435663]">{event.capacity} pax</td>
                    <td className="p-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${count >= event.capacity ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                        {count} Registered
                      </span>
                    </td>
                    <td className="p-5 text-right flex justify-end gap-3">
                      <button className="text-[#313647] hover:text-[#435663] text-xs font-bold bg-[#FFF8D4] px-3 py-1.5 rounded-lg border border-[#435663]/20">View List</button>
                      <button onClick={(e) => handleArchive(e, event.event_id)} className="text-[#435663] hover:text-red-600 text-xs font-bold px-2 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredEvents.length === 0 && <tr><td colSpan="5" className="p-10 text-center text-[#435663]">No events found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- PARTICIPANT MODAL --- */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#313647]/70 backdrop-blur-sm">
          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="bg-[#313647] p-6 flex justify-between items-center text-white shrink-0">
              <div>
                <h2 className="text-2xl font-bold">{selectedEvent.name}</h2>
                <div className="flex gap-4 text-[#FFF8D4] text-sm mt-1 opacity-80">
                  <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> {selectedEvent.venue}</span>
                  <span className="flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> {new Date(selectedEvent.event_date).toLocaleDateString()}</span>
                </div>
              </div>
              <button onClick={closeModal} className="text-white/60 hover:text-white transition text-2xl font-bold bg-[#435663] w-8 h-8 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-4 bg-[#FFF8D4]/30 border-b border-[#435663]/10 flex justify-between items-center">
              <h3 className="font-bold text-[#313647]">Participant List</h3>
              <div className="relative">
                <input type="text" placeholder="Search Student..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
                  className="pl-9 pr-4 py-2 w-64 bg-white border border-[#435663]/20 rounded-lg text-sm focus:ring-2 focus:ring-[#313647] outline-none" />
                <svg className="w-4 h-4 text-[#435663] absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
            </div>

            <div className="overflow-y-auto p-0 bg-slate-50">
              <table className="w-full text-left border-collapse bg-white shadow-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="p-4 text-xs font-bold text-[#435663] uppercase sticky top-0 bg-gray-50">Participant</th>
                    <th className="p-4 text-xs font-bold text-[#435663] uppercase sticky top-0 bg-gray-50">Organization</th>
                    <th className="p-4 text-xs font-bold text-[#435663] uppercase text-center sticky top-0 bg-gray-50">Payment</th>
                    <th className="p-4 text-xs font-bold text-[#435663] uppercase text-center sticky top-0 bg-gray-50">Attendance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {eventParticipants.map((reg) => (
                    <tr key={reg.registration_id} className="hover:bg-[#FFF8D4]/20 transition">
                      <td className="p-4">
                        <div className="font-bold text-[#313647] text-sm">{reg.Participant?.last_name}, {reg.Participant?.first_name}</div>
                        <div className="text-xs text-[#435663]">{reg.Participant?.email}</div>
                      </td>
                      <td className="p-4 text-sm text-[#435663]">{reg.Participant?.organization_or_school}</td>
                      <td className="p-4 text-center">
                        <button onClick={() => togglePayment(reg.registration_id, reg.Payment?.payment_status)}
                          className={`px-3 py-1 rounded-md text-xs font-bold transition border w-24 ${
                            reg.Payment?.payment_status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                          {reg.Payment?.payment_status || 'Pending'}
                        </button>
                      </td>
                      <td className="p-4 text-center">
                        <button onClick={() => toggleAttendance(reg.registration_id, reg.attendance_status)}
                          className={`px-3 py-1 rounded-md text-xs font-bold border transition w-28 ${
                            reg.attendance_status === 'Present' ? 'bg-[#313647] text-white border-[#313647]' : 'bg-white text-[#435663] border-[#435663]/30'
                          }`}>
                          {reg.attendance_status === 'Present' ? '✔ Present' : 'Mark Present'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {eventParticipants.length === 0 && <tr><td colSpan="4" className="p-12 text-center text-[#435663] italic">No matching records found.</td></tr>}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-white border-t border-gray-200 shrink-0 flex justify-end">
              <button onClick={closeModal} className="bg-gray-100 hover:bg-gray-200 text-[#313647] px-6 py-2 rounded-lg font-bold transition">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* --- ARCHIVE MODAL --- */}
      {isArchiveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#313647]/70 backdrop-blur-sm">
          <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-[#435663] p-5 flex justify-between items-center text-white shrink-0">
              <div><h2 className="text-xl font-bold">Archived Events</h2><p className="text-white/70 text-xs mt-1">History of past events</p></div>
              <button onClick={() => setIsArchiveModalOpen(false)} className="text-white/70 hover:text-white transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="overflow-y-auto p-0 bg-white">
              <table className="w-full text-left border-collapse bg-white">
                <thead className="bg-[#FFF8D4]/50 border-b border-[#435663]/10">
                  <tr>
                    <th className="p-4 text-xs font-bold text-[#435663] uppercase">Event Name</th>
                    <th className="p-4 text-xs font-bold text-[#435663] uppercase">Date</th>
                    <th className="p-4 text-xs font-bold text-[#435663] uppercase text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {events.filter(e => e.is_archived).map(event => (
                    <tr key={event.event_id} className="hover:bg-[#FFF8D4]/20">
                      <td className="p-4 font-bold text-[#313647]">{event.name}</td>
                      <td className="p-4 text-sm text-[#435663]">{new Date(event.event_date).toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => handleRestore(event.event_id)} className="text-[#313647] hover:text-blue-600 text-xs font-bold border border-[#313647]/20 bg-white px-3 py-1.5 rounded-lg transition flex items-center gap-1 ml-auto">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                          Restore
                        </button>
                      </td>
                    </tr>
                  ))}
                  {events.filter(e => e.is_archived).length === 0 && <tr><td colSpan="3" className="p-8 text-center text-[#435663] italic">No archived events found.</td></tr>}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 bg-white border-t border-gray-200 shrink-0 flex justify-end">
              <button onClick={() => setIsArchiveModalOpen(false)} className="bg-gray-100 hover:bg-gray-200 text-[#313647] px-6 py-2 rounded-lg font-bold transition">Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}