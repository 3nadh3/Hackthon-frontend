import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/DashBoard';
import ProfileForm from './components/ProfileForm';
import UpdateProfile from './components/UpdateProfile';
import Chat from './components/Chat';
// In index.js or App.js
import 'font-awesome/css/font-awesome.min.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/RegisterForm" element={<RegisterForm />} />
        <Route path='/Dashboard' element={<Dashboard />} />
        <Route path='/ProfileForm' element={<ProfileForm />} />
        <Route path='/UpdateProfile' element={<UpdateProfile />} />
        <Route path='/Chat' element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
