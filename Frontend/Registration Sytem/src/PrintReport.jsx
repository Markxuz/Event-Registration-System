import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function PrintReport() {
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/api/registrations/dashboard')
      .then(res => setRegistrations(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-white p-12 text-slate-900 font-sans">
      
      {/* Controls */}
      <div className="print:hidden flex justify-between items-center mb-8 border border-slate-200 p-4 rounded bg-slate-50">
        <Link to="/admin" className="text-sm font-medium text-slate-600 hover:text-slate-900">← Back to Dashboard</Link>
        <button onClick={() => window.print()} className="bg-slate-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-slate-800">
          Print Document
        </button>
      </div>

      {/* Header */}
      <div className="mb-8 border-b border-slate-900 pb-4">
        <h1 className="text-2xl font-bold uppercase tracking-wider mb-1">Official Attendance Record</h1>
        <p className="text-sm text-slate-500">Generated: {new Date().toLocaleDateString()}</p>
      </div>

      {/* Formal Table */}
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-900">
            <th className="py-2 font-bold uppercase">Participant Name</th>
            <th className="py-2 font-bold uppercase">Organization</th>
            <th className="py-2 font-bold uppercase">Event</th>
            <th className="py-2 font-bold uppercase text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {registrations.map((reg) => (
            <tr key={reg.registration_id}>
              <td className="py-3 font-medium">{reg.Participant?.last_name}, {reg.Participant?.first_name}</td>
              <td className="py-3 text-slate-600">{reg.Participant?.organization_or_school}</td>
              <td className="py-3 text-slate-600">{reg.Event?.name}</td>
              <td className="py-3 text-right">
                <span className={`px-2 py-1 border rounded text-xs font-bold ${reg.attendance_status === 'Present' ? 'border-slate-900 text-slate-900' : 'border-slate-200 text-slate-400'}`}>
                  {reg.attendance_status.toUpperCase()}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Print Style */}
      <style>{`@media print { .print\\:hidden { display: none; } }`}</style>
    </div>
  );
}