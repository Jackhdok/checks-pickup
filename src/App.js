import React, { useState, useEffect } from 'react';
import AdminPage from './components/AdminPage';
import PublicCheckIn from './components/PublicCheckIn';
import DatabaseService from './services/database';
import './App.css';

function App({ initialView = 'public' }) {
  const [waitingList, setWaitingList] = useState([]);
  const [isLightMode, setIsLightMode] = useState(false);
  const [currentView, setCurrentView] = useState(initialView); // 'admin' or 'public'
  const [calledClient, setCalledClient] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load clients from database on component mount
  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const clients = await DatabaseService.getClients();
      setWaitingList(clients);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
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
      const updatedClient = await DatabaseService.updateClientStatus(id, status.toUpperCase());
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
          client.id === id ? { ...client, status: status.toUpperCase() } : client
        )
      );
    }
  };

  const callClient = async (id) => {
    const client = waitingList.find(c => c.id === id);
    if (client) {
      setCalledClient(client);
      await updateClientStatus(id, 'called');
      
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
      <AdminPage
        waitingList={waitingList}
        onRemove={removeFromWaitingList}
        onUpdateStatus={updateClientStatus}
        onCallClient={callClient}
        isLightMode={isLightMode}
        onBackToPublic={() => (window.location.href = '/check-in')}
        onOpenPublicCheckIn={() => (window.location.href = '/check-in')}
      />
    );
  }

  return (
    <PublicCheckIn
      waitingList={waitingList}
      onAddToWaitingList={addToWaitingList}
      isLightMode={isLightMode}
      setIsLightMode={setIsLightMode}
      calledClient={calledClient}
    />
  );
}

export default App;
