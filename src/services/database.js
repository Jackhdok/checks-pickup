// Database service for client operations
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://checks-pickup-ohn1x0d0t-jack-hds-projects.vercel.app/api'
  : 'http://localhost:3000/api';

class DatabaseService {
  // Get all clients
  static async getClients() {
    try {
      console.log('Fetching clients from:', `${API_BASE_URL}/clients`);
      const response = await fetch(`${API_BASE_URL}/clients`);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Fetched clients:', data);
      return data;
    } catch (error) {
      console.error('Error fetching clients:', error);
      return [];
    }
  }

  // Create new client
  static async createClient(clientData) {
    try {
      const response = await fetch(`${API_BASE_URL}/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  }

  // Update client status
  static async updateClientStatus(id, status) {
    try {
      const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating client status:', error);
      throw error;
    }
  }

  // Delete client
  static async deleteClient(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  }
}

export default DatabaseService;
