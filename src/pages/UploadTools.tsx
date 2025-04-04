import React from 'react';
import UploadToolsPage from '../components/UploadToolsPage';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const UploadTools: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-one-dark flex flex-col">
      <Navbar />
      <div className="flex-1 pt-16">
        <UploadToolsPage onBack={handleBack} />
      </div>
    </div>
  );
};

export default UploadTools; 