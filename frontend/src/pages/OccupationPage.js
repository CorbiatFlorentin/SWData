import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import '../assets/style/OccupationPage.css';

const OccupationPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      navigate('/register');
    }
  }, [user, navigate]);

  return (
    <div className="occupation-container">
    </div>
  );
};

export default OccupationPage;
