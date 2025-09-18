import React from 'react';
import { Clock, User, CheckCircle } from 'lucide-react';
import './PublicWaitingList.css';

const PublicWaitingList = ({ waitingList, isLightMode }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting':
      case 'WAITING':
        return '#f59e0b';
      case 'called':
      case 'CALLED':
        return '#8b5cf6';
      case 'in-progress':
      case 'IN_PROGRESS':
        return '#3b82f6';
      case 'completed':
      case 'COMPLETED':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'waiting':
      case 'WAITING':
        return <Clock size={16} />;
      case 'called':
      case 'CALLED':
        return <CheckCircle size={16} />;
      case 'in-progress':
      case 'IN_PROGRESS':
        return <CheckCircle size={16} />;
      case 'completed':
      case 'COMPLETED':
        return <CheckCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getWaitingTime = (checkInTime) => {
    const now = new Date();
    const checkIn = new Date(checkInTime);
    const diffMs = now - checkIn;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    const remainingMins = diffMins % 60;
    
    if (diffHours < 24) {
      return remainingMins > 0 ? `${diffHours}h ${remainingMins}m ago` : `${diffHours}h ago`;
    }
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  if (waitingList.length === 0) {
    return (
      <div className={`public-waiting-list ${isLightMode ? 'light-mode' : ''}`}>
        <div className="waiting-list-header">
          <h2>Waiting List</h2>
          <span className="count">0</span>
        </div>
        <div className="empty-state">
          <Clock size={48} className="empty-icon" />
          <h3>No one in queue</h3>
          <p>Clients will appear here when they check in</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`public-waiting-list ${isLightMode ? 'light-mode' : ''}`}>
      <div className="waiting-list-header">
        <h2>Waiting List</h2>
        <span className="count">{waitingList.length}</span>
      </div>
      
      <div className="waiting-list-content">
        {waitingList.map((client, index) => (
          <div key={client.id} className={`client-card ${client.status}`}>
            <div className="client-info">
              <div className="client-header">
                <div className="client-name">
                  <User size={16} />
                  <span>{client.name}</span>
                </div>
                <div className="queue-position">#{index + 1}</div>
              </div>
              
              <div className="client-details">
                <div className="detail-item">
                  <User size={14} />
                  <span className="detail-label">Manager:</span>
                  <span className="detail-value">
                    {client.manager || 'Unknown Manager'}
                  </span>
                </div>
                
                <div className="detail-item">
                  <Clock size={14} />
                  <span className="detail-label">Check-in:</span>
                  <span className="detail-value">{formatTime(client.checkInTime)}</span>
                </div>
                
                <div className="detail-item">
                  <Clock size={14} />
                  <span className="detail-label">Waiting:</span>
                  <span className="detail-value">{getWaitingTime(client.checkInTime)}</span>
                </div>
              </div>
              
              <div className="client-status">
                <div 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(client.status) }}
                >
                  {getStatusIcon(client.status)}
                  <span>{client.status.replace('-', ' ')}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicWaitingList;

