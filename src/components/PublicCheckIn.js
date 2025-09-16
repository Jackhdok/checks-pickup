import React from 'react';
import CheckInForm from './CheckInForm';
import PublicWaitingList from './PublicWaitingList';
import ThemeToggle from './ThemeToggle';
import './PublicCheckIn.css';

const PublicCheckIn = ({ 
  waitingList, 
  onAddToWaitingList, 
  isLightMode, 
  setIsLightMode, 
  calledClient 
}) => {

  return (
    <div className={`public-checkin ${isLightMode ? 'light-mode' : ''}`}>
      <header className="public-header">
        <div className="public-header-content">
          <div className="public-title-section">
            <h1>Check-in Waiting List</h1>
            <p>Please check in to join the waiting list</p>
          </div>
          <ThemeToggle isLightMode={isLightMode} setIsLightMode={setIsLightMode} />
        </div>
      </header>
      
      {/* Call Notification */}
      {calledClient && (
        <div className="call-notification">
          <div className="call-content">
            <h3>📢 Please come to Accounting Room</h3>
            <p>{calledClient.name} - {calledClient.phone}</p>
          </div>
        </div>
      )}
      
      <main className="public-main">
        <div className="public-container">
          <CheckInForm onAddToWaitingList={onAddToWaitingList} isLightMode={isLightMode} />
          <PublicWaitingList 
            waitingList={waitingList.filter(client => client.status !== 'completed')} 
            isLightMode={isLightMode}
          />
        </div>
      </main>
    </div>
  );
};

export default PublicCheckIn;
