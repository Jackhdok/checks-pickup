import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPage from './components/AdminPage';
import PublicCheckIn from './components/PublicCheckIn';
import DatabaseService from './services/database';
import './App.css';

function App({ initialView = 'public' }) {
  const navigate = useNavigate();
  const [waitingList, setWaitingList] = useState([]);
  const [isLightMode, setIsLightMode] = useState(false);
  const [currentView, setCurrentView] = useState(initialView); // 'admin' or 'public'
  const [calledClient, setCalledClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const lastStatusesRef = useRef({});

  // Update currentView when initialView prop changes
  useEffect(() => {
    setCurrentView(initialView);
  }, [initialView]);

  // Load and poll clients
  useEffect(() => {
    let isMounted = true;
    console.log('App: Setting up auto-refresh for view:', currentView);
    
    const fetchClients = async (isBackground = false) => {
      try {
        console.log('App: Fetching clients, background:', isBackground);
        if (!isBackground) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }
        const clients = await DatabaseService.getClients();
        if (!isMounted) return;
        console.log('App: Received clients:', clients.length);
        setWaitingList(clients);
        // Detect newly ready (IN_PROGRESS) clients for public notification
        const prev = lastStatusesRef.current;
        const statusMap = {};
        clients.forEach(c => { statusMap[c.id] = c.status; });
        const newlyReady = clients.find(c => c.status === 'IN_PROGRESS' && prev[c.id] && prev[c.id] !== 'IN_PROGRESS');
        if (newlyReady) {
          console.log('App: Newly ready client:', newlyReady);
          setCalledClient(newlyReady);
          setTimeout(() => setCalledClient(null), 5000);
        }
        lastStatusesRef.current = statusMap;
      } catch (error) {
        console.error('Error loading clients:', error);
      } finally {
        if (!isBackground) {
          setLoading(false);
        } else {
          setRefreshing(false);
        }
      }
    };

    fetchClients();
    console.log('App: Setting up 5-second interval');
    const intervalId = setInterval(() => {
      console.log('App: Auto-refresh triggered');
      fetchClients(true);
    }, 5000);
    
    return () => {
      console.log('App: Cleaning up auto-refresh');
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [currentView]); // Add currentView dependency to restart when view changes

  const normalizeStatus = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'waiting': return 'WAITING';
      case 'called': return 'CALLED';
      case 'in-progress': return 'IN_PROGRESS';
      case 'completed': return 'COMPLETED';
      default: return status && status.toUpperCase ? status.toUpperCase() : 'WAITING';
    }
  };

  const addToWaitingList = async (clientData) => {
    try {
      const newClient = await DatabaseService.createClient({
        ...clientData,
        type: clientData.type.toUpperCase()
      });
      setWaitingList(prev => [...prev, newClient]);
    } catch (error) {
      console.error('Error adding client:', error);
      // Fallback to local state if database fails
      const fallbackClient = {
        id: Date.now().toString(),
        ...clientData,
        checkInTime: new Date().toISOString(),
        status: 'WAITING'
      };
      setWaitingList(prev => [...prev, fallbackClient]);
    }
  };

  const removeFromWaitingList = async (id) => {
    try {
      await DatabaseService.deleteClient(id);
      setWaitingList(prev => prev.filter(client => client.id !== id));
    } catch (error) {
      console.error('Error removing client:', error);
      // Fallback to local state if database fails
      setWaitingList(prev => prev.filter(client => client.id !== id));
    }
  };

  const updateClientStatus = async (id, status) => {
    try {
      const normalized = normalizeStatus(status);
      const updatedClient = await DatabaseService.updateClientStatus(id, normalized);
      setWaitingList(prev => 
        prev.map(client => 
          client.id === id ? updatedClient : client
        )
      );
    } catch (error) {
      console.error('Error updating client status:', error);
      // Fallback to local state if database fails
      setWaitingList(prev => 
        prev.map(client => 
          client.id === id ? { ...client, status: normalizeStatus(status) } : client
        )
      );
    }
  };

  const callClient = async (id) => {
    const client = waitingList.find(c => c.id === id);
    if (client) {
      setCalledClient(client);
      await updateClientStatus(id, 'CALLED');
      
      // Client called - notification handled by UI
      
      // Show call notification for 5 seconds
      setTimeout(() => {
        setCalledClient(null);
      }, 5000);
    }
  };


  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading clients...</p>
      </div>
    );
  }

  if (currentView === 'admin') {
    return (
      <div>
        {refreshing && (
          <div className="refresh-indicator">
            <div className="refresh-spinner"></div>
            <span>Refreshing...</span>
          </div>
        )}
        <AdminPage
          waitingList={waitingList}
          onRemove={removeFromWaitingList}
          onUpdateStatus={updateClientStatus}
          onCallClient={callClient}
          isLightMode={isLightMode}
          onBackToPublic={() => navigate('/check-in')}
          onOpenPublicCheckIn={() => navigate('/check-in')}
        />
      </div>
    );
  }

  return (
    <div>
      {refreshing && (
        <div className="refresh-indicator">
          <div className="refresh-spinner"></div>
          <span>Refreshing...</span>
        </div>
      )}
      <PublicCheckIn
        waitingList={waitingList}
        onAddToWaitingList={addToWaitingList}
        isLightMode={isLightMode}
        setIsLightMode={setIsLightMode}
        calledClient={calledClient}
      />
    </div>
  );
}

export default App;
