import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('username');
    
    if (!token) {
      navigate('/login');
    } else {
      setUsername(storedUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div>
      <h1>Hello, {username || 'User'}!</h1>
      <p>Welcome to the Chat App.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Home;
