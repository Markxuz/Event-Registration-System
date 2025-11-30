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
    <div className="min-h-screen bg-gray-500 p-8 flex justify-center print:p-0 print:bg-white">
      
      {/* Paper Container */}
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200 print:shadow-none print:border-none print:w-full">
        
        <div className="bg-slate-900 p-8 text-center relative print:bg-white print:border-b-2 print:border-black">
          
          {/* Controls (Hidden when printing) */}
          <div className="print:hidden absolute top-5 right-5 flex gap-3">
             <button 
              onClick={() => window.print()} 
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded transition shadow-md flex items-center gap-1"
            >
               Print Report
            </button>
            <Link to="/admin" className="text-slate-500 hover:text-white transition text-xl font-bold" title="Close">
              ✕
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-white tracking-wide print:text-black uppercase">Official Attendance Report</h1>
          <p className="text-slate-400 mt-2 text-sm print:text-gray-600">
            Generated on: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-8 print:p-0 print:mt-4">
          
          {/* Formal Table */}
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-slate-800">
                <th className="py-3 font-bold uppercase text-slate-800">Participant Name</th>
                <th className="py-3 font-bold uppercase text-slate-800">Organization</th>
                <th className="py-3 font-bold uppercase text-slate-800">Event</th>
                <th className="py-3 font-bold uppercase text-slate-800 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {registrations.length > 0 ? (
                registrations.map((reg) => (
                  <tr key={reg.registration_id}>
                    <td className="py-3 font-bold text-slate-700">
                      {reg.Participant?.last_name}, {reg.Participant?.first_name}
                    </td>
                    <td className="py-3 text-slate-600">{reg.Participant?.organization_or_school}</td>
                    <td className="py-3 text-slate-600">{reg.Event?.name}</td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-bold border ${
                        reg.attendance_status === 'Present' 
                          ? 'border-slate-800 text-slate-800 bg-slate-50' 
                          : 'border-slate-200 text-slate-400'
                      }`}>
                        {reg.attendance_status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-slate-400 italic">No records found.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Signature Area */}
          <div className="mt-16 flex justify-end print:mt-24">
            <div className="text-center w-64">
              <div className="border-b border-slate-900 mb-2"></div>
              <p className="font-bold uppercase text-xs text-slate-600">Certified Correct By</p>
            </div>
          </div>

        </div>
      </div>

      {/* Force hide default browser print headers/footers if possible via CSS */}
      <style>{`
        @media print {
          @page { margin: 0.5in; }
          body { background: white; }
        }
      `}</style>
    </div>
  );
}