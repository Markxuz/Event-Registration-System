import { Routes, Route } from 'react-router-dom';
import RegistrationForm from './RegistrationForm';
import Dashboard from './Dashboard';
import CreateEvent from './CreateEvent'; 
import PrintReport from './PrintReport';

function App() {
  return (
    <Routes>
      <Route path="/" element={<RegistrationForm />} />
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/create-event" element={<CreateEvent />} /> 
      <Route path="/print-report" element={<PrintReport />} />
    </Routes>
  );
}

export default App;