import './App.css';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ContactDetails from './pages/ContactDetails';
import ErrorPage from './pages/ErrorPage';
import AddContact from './pages/AddContact';
import EditContact from './pages/EditContact';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/'  element={<HomePage/>} />
        <Route path="/contacts/:id" element={<ContactDetails />} />
        <Route path="/add" element={<AddContact />} />
        <Route path="/edit/:id" element={<EditContact />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
        
    </div>
  );
}

export default App;
