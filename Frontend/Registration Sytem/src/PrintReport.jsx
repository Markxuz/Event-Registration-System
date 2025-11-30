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
    <div className="min-h-screen bg-[#FFF8D4] p-8 flex justify-center print:p-0 print:bg-white font-sans text-[#313647]">
      
      {/* Paper Container */}
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden border border-[#313647]/10 print:shadow-none print:border-none print:w-full">
        
        <div className="bg-[#313647] p-8 text-center relative print:bg-white print:border-b-2 print:border-black">
          
          {/* Controls (Hidden when printing) */}
          <div className="print:hidden absolute top-5 right-5 flex gap-3">
             <button 
              onClick={() => window.print()} 
              className="bg-[#435663] hover:bg-[#566b7a] text-white text-xs font-bold px-3 py-1.5 rounded transition shadow-md flex items-center gap-1"
            >
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
               Print
            </button>
            <Link to="/admin" className="text-[#FFF8D4] hover:text-white transition text-xl font-bold" title="Close">
              ✕
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-white tracking-wide print:text-black uppercase">Official Attendance Report</h1>
          <p className="text-[#FFF8D4]/70 mt-2 text-sm print:text-gray-600">
            Generated on: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-8 print:p-0 print:mt-4">
          
          {/* Formal Table */}
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-[#313647] print:border-black">
                <th className="py-3 font-bold uppercase text-[#313647] print:text-black">Participant Name</th>
                <th className="py-3 font-bold uppercase text-[#313647] print:text-black">Organization</th>
                <th className="py-3 font-bold uppercase text-[#313647] print:text-black">Event</th>
                <th className="py-3 font-bold uppercase text-[#313647] print:text-black text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {registrations.length > 0 ? (
                registrations.map((reg) => (
                  <tr key={reg.registration_id}>
                    <td className="py-3 font-bold text-[#435663] print:text-black">
                      {reg.Participant?.last_name}, {reg.Participant?.first_name}
                    </td>
                    <td className="py-3 text-gray-600">{reg.Participant?.organization_or_school}</td>
                    <td className="py-3 text-gray-600">{reg.Event?.name}</td>
                    <td className="py-3 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-bold border ${
                        reg.attendance_status === 'Present' 
                          ? 'border-[#313647] text-[#313647] bg-[#FFF8D4]/50 print:border-black print:text-black' 
                          : 'border-gray-300 text-gray-400'
                      }`}>
                        {reg.attendance_status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-gray-400 italic">No records found.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Signature Area */}
          <div className="mt-16 flex justify-end print:mt-24">
            <div className="text-center w-64">
              <div className="border-b border-[#313647] print:border-black mb-2"></div>
              <p className="font-bold uppercase text-xs text-[#435663] print:text-black">Certified Correct By</p>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media print {
          @page { margin: 0.5in; }
          body { background: white; }
        }
      `}</style>
    </div>
  );
}