import React from 'react';
import { Clock, User, Phone, Building2, Package, CheckCircle, X } from 'lucide-react';
import './WaitingList.css';

const WaitingList = ({ waitingList, onRemove, onUpdateStatus, isLightMode, isPublicView = false }) => {
  const handleStartService = async (clientId) => {
    const client = waitingList.find(c => c.id === clientId);
    if (client) {
      // Update status to in-progress (ready to pick up check)
      onUpdateStatus(clientId, 'in-progress');
      
      // Client ready for pickup - notification handled by UI
    }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case 'waiting':
        return '#f59e0b';
      case 'in-progress':
        return '#3b82f6';
      case 'completed':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'waiting':
        return <Clock size={16} />;
      case 'in-progress':
        return <CheckCircle size={16} />;
      case 'completed':
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

  if (waitingList.length === 0) {
    return (
      <div className={`waiting-list ${isLightMode ? 'light-mode' : ''}`}>
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
    <div className={`waiting-list ${isLightMode ? 'light-mode' : ''}`}>
      <div className="waiting-list-header">
        <h2>Waiting List</h2>
        <span className="count">{waitingList.length}</span>
      </div>
      
      <div className="waiting-list-content">
        {waitingList.map((client, index) => (
          <div key={client.id} className={`client-card ${client.status}`}>
            <div className="client-info">
              <div className="client-header">
                <div className="client-basic-info">
                  <div className="client-name">
                    <User size={16} />
                    <span>{client.name}</span>
                  </div>
                  <div className="client-phone">
                    <Phone size={16} />
                    <span>{client.phone}</span>
                  </div>
                </div>
                      {!isPublicView && (
                        <div className="client-actions">
                          <button
                            className="action-button"
                            onClick={() => onRemove(client.id)}
                            title="Remove from list"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
              </div>
              
              <div className="client-details">
                <div className="detail-item">
                  <Building2 size={14} />
                  <span className="detail-label">Type:</span>
                  <span className={`detail-value type-${client.type}`}>
                    {client.type === 'vendor' ? 'Vendor' : 'Subvendor'}
                  </span>
                </div>
                
                <div className="detail-item">
                  <Package size={14} />
                  <span className="detail-label">Purpose:</span>
                  <span className="detail-value">Pickup Check</span>
                </div>
                
                <div className="detail-item">
                  <Clock size={14} />
                  <span className="detail-label">Check-in:</span>
                  <span className="detail-value">{formatTime(client.checkInTime)}</span>
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
                <span className="queue-position">#{index + 1}</span>
              </div>
            </div>
            
            {!isPublicView && client.status === 'waiting' && (
              <div className="status-actions">
                <button
                  className="status-button in-progress"
                  onClick={() => handleStartService(client.id)}
                >
                  Ready for Pickup
                </button>
              </div>
            )}
            
            {!isPublicView && client.status === 'in-progress' && (
              <div className="status-actions">
                <button
                  className="status-button completed"
                  onClick={() => onUpdateStatus(client.id, 'completed')}
                >
                  Complete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WaitingList;
