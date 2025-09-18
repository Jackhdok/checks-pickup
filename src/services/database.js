// Database service for client operations
// Use relative path in production so it works with any deployment URL
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? ''
  : 'http://localhost:3000';

class DatabaseService {
  // Get all clients
  static async getClients() {
    try {
      console.log('Fetching clients from:', `${API_BASE_URL}/clients`);
      const response = await fetch(`${API_BASE_URL}/api/clients`);
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
      const response = await fetch(`${API_BASE_URL}/api/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
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
      console.log('Updating client status:', { id, status });
      const response = await fetch(`${API_BASE_URL}/api/clients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      console.log('Update response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update API Error:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Update result:', result);
      return result;
    } catch (error) {
      console.error('Error updating client status:', error);
      throw error;
    }
  }

  // Delete client
  static async deleteClient(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/clients/${id}`, {
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

  // Manager operations
  static async getManagers() {
    try {
      console.log('Fetching managers from:', `${API_BASE_URL}/managers`);
      const response = await fetch(`${API_BASE_URL}/api/managers`);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Fetched managers:', data);
      return data;
    } catch (error) {
      console.error('Error fetching managers:', error);
      return [];
    }
  }

  static async createManager(managerData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/managers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(managerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating manager:', error);
      throw error;
    }
  }

  static async updateManager(id, managerData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/managers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(managerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating manager:', error);
      throw error;
    }
  }

  static async deleteManager(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/managers/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Error deleting manager:', error);
      throw error;
    }
  }
}

export default DatabaseService;
