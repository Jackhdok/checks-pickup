import React, { useState } from 'react';
import { Users, Phone, Building2, Package, Clock, CheckCircle, X, Megaphone, User, Monitor } from 'lucide-react';
import './AdminPage.css';

const AdminPage = ({ waitingList, onRemove, onUpdateStatus, onCallClient, isLightMode, onBackToPublic, onOpenPublicCheckIn }) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredList = waitingList.filter(client => {
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus;
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.phone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'WAITING':
        return '#f59e0b';
      case 'CALLED':
        return '#8b5cf6';
      case 'IN_PROGRESS':
        return '#3b82f6';
      case 'COMPLETED':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'WAITING':
        return <Clock size={16} />;
      case 'CALLED':
        return <Megaphone size={16} />;
      case 'IN_PROGRESS':
        return <CheckCircle size={16} />;
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

  const handleCallClient = (clientId) => {
    onCallClient(clientId);
    // Show notification for 3 seconds
    setTimeout(() => {
      // You could add a notification system here
    }, 3000);
  };

  const handleStartService = async (clientId) => {
    const client = waitingList.find(c => c.id === clientId);
    if (client) {
      // Update status to in-progress (ready to pick up check)
      onUpdateStatus(clientId, 'in-progress');
      
      // Client ready for pickup - notification handled by UI
    }
  };

  const handleCompleteClient = (clientId) => {
    onUpdateStatus(clientId, 'completed');
    // Remove from public view after a short delay
    setTimeout(() => {
      onRemove(clientId);
    }, 2000);
  };

  const getStatusCounts = () => {
    return {
      waiting: waitingList.filter(c => c.status === 'WAITING').length,
      called: waitingList.filter(c => c.status === 'CALLED').length,
      inProgress: waitingList.filter(c => c.status === 'IN_PROGRESS').length,
      completed: waitingList.filter(c => c.status === 'COMPLETED').length,
      total: waitingList.length
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className={`admin-page ${isLightMode ? 'light-mode' : ''}`}>
      <div className="admin-header">
        <div className="admin-header-content">
          <div className="admin-title-section">
            <h1>Admin Dashboard</h1>
            <p>Manage waiting list and client calls</p>
          </div>
          <div className="admin-header-actions">
            <button className="public-checkin-button" onClick={onOpenPublicCheckIn}>
              <Monitor size={20} />
              <span>Open Check-in Page</span>
            </button>
          </div>
        </div>
      </div>

      <div className="admin-main">
        <div className="admin-container">
          {/* Statistics Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon waiting">
                <Clock size={24} />
              </div>
              <div className="stat-content">
                <h3>{statusCounts.waiting}</h3>
                <p>Waiting</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon called">
                <Megaphone size={24} />
              </div>
              <div className="stat-content">
                <h3>{statusCounts.called}</h3>
                <p>Called</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon in-progress">
                <CheckCircle size={24} />
              </div>
              <div className="stat-content">
                <h3>{statusCounts.inProgress}</h3>
                <p>In Progress</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon completed">
                <CheckCircle size={24} />
              </div>
              <div className="stat-content">
                <h3>{statusCounts.completed}</h3>
                <p>Completed</p>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="admin-controls">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                onClick={() => setFilterStatus('all')}
              >
                All ({statusCounts.total})
              </button>
              <button
                className={`filter-btn ${filterStatus === 'waiting' ? 'active' : ''}`}
                onClick={() => setFilterStatus('waiting')}
              >
                Waiting ({statusCounts.waiting})
              </button>
              <button
                className={`filter-btn ${filterStatus === 'called' ? 'active' : ''}`}
                onClick={() => setFilterStatus('called')}
              >
                Called ({statusCounts.called})
              </button>
            </div>
          </div>

          {/* Client List */}
          <div className="admin-client-list">
            {filteredList.length === 0 ? (
              <div className="empty-state">
                <Users size={48} className="empty-icon" />
                <h3>No clients found</h3>
                <p>No clients match your current filters</p>
              </div>
            ) : (
              filteredList.map((client, index) => (
                <div key={client.id} className={`admin-client-card ${client.status}`}>
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
                      <div className="client-actions">
                        <button
                          className="action-button remove"
                          onClick={() => onRemove(client.id)}
                          title="Remove from list"
                        >
                          <X size={16} />
                        </button>
                      </div>
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
                  
                  <div className="admin-actions">
                    {client.status === 'WAITING' && (
                      <button
                        className="admin-action-btn call"
                        onClick={() => handleCallClient(client.id)}
                      >
                        <Megaphone size={16} />
                        Call Client
                      </button>
                    )}
                    
                    {client.status === 'CALLED' && (
                      <button
                        className="admin-action-btn in-progress"
                        onClick={() => handleStartService(client.id)}
                      >
                        <CheckCircle size={16} />
                        Ready for Pickup
                      </button>
                    )}
                    
                    {client.status === 'IN_PROGRESS' && (
                      <button
                        className="admin-action-btn complete"
                        onClick={() => handleCompleteClient(client.id)}
                      >
                        <CheckCircle size={16} />
                        Complete
                      </button>
                    )}
                    
                    {client.status === 'COMPLETED' && (
                      <div className="completed-message">
                        <CheckCircle size={16} />
                        <span>Service Completed</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
