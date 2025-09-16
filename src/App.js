import React, { useState } from 'react';
import AdminPage from './components/AdminPage';
import PublicCheckIn from './components/PublicCheckIn';
import sendSMSNotification from './services/smsWebhook';
import './App.css';

function App() {
  const [waitingList, setWaitingList] = useState([]);
  const [isLightMode, setIsLightMode] = useState(false);
  const [currentView, setCurrentView] = useState('admin'); // 'admin' or 'public'
  const [calledClient, setCalledClient] = useState(null);

  const addToWaitingList = (clientData) => {
    const newClient = {
      id: Date.now(),
      ...clientData,
      checkInTime: new Date().toLocaleString(),
      status: 'waiting'
    };
    setWaitingList(prev => [...prev, newClient]);
  };

  const removeFromWaitingList = (id) => {
    setWaitingList(prev => prev.filter(client => client.id !== id));
  };

  const updateClientStatus = (id, status) => {
    setWaitingList(prev => 
      prev.map(client => 
        client.id === id ? { ...client, status } : client
      )
    );
  };

  const callClient = async (id) => {
    const client = waitingList.find(c => c.id === id);
    if (client) {
      setCalledClient(client);
      updateClientStatus(id, 'called');
      
      // Send SMS notification to the client
      try {
        await sendSMSNotification(client);
      } catch (error) {
        console.error('Error sending SMS notification:', error);
        // Continue even if SMS fails
      }
      
      // Show call notification for 5 seconds
      setTimeout(() => {
        setCalledClient(null);
      }, 5000);
    }
  };


  if (currentView === 'admin') {
    return (
      <AdminPage
        waitingList={waitingList}
        onRemove={removeFromWaitingList}
        onUpdateStatus={updateClientStatus}
        onCallClient={callClient}
        isLightMode={isLightMode}
        onBackToPublic={() => setCurrentView('public')}
        onOpenPublicCheckIn={() => setCurrentView('public')}
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
