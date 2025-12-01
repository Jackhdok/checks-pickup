import React, { useState } from 'react';
import { User, Phone, Building2, Package, CheckCircle, FolderOpen } from 'lucide-react';
import './CheckInForm.css';

const CheckInForm = ({ onAddToWaitingList, isLightMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    type: '',
    manager: '',
    purpose: 'pickup',
    projects: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s\-+()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.type) {
      newErrors.type = 'Please select vendor type';
    }
    
    if (!formData.manager) {
      newErrors.manager = 'Please select a manager';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Add to waiting list (Teams notification will be sent by the API)
      await onAddToWaitingList(formData);
      
      // Reset form
      setFormData({
        name: '',
        phone: '',
        type: '',
        manager: '',
        purpose: 'pickup',
        projects: ''
      });
      
      setShowSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error during check-in:', error);
      // Still add to waiting list even if Teams notification fails
      await onAddToWaitingList(formData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`checkin-form ${isLightMode ? 'light-mode' : ''}`}>
      <div className="form-header">
        <h2>Check In</h2>
        <p>Please provide your information to join the waiting list</p>
      </div>
      
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            <User size={20} />
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`form-input ${errors.name ? 'error' : ''}`}
            placeholder="Enter your full name"
            disabled={isSubmitting}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="phone" className="form-label">
            <Phone size={20} />
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={`form-input ${errors.phone ? 'error' : ''}`}
            placeholder="Enter your phone number"
            disabled={isSubmitting}
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">
            <Building2 size={20} />
            Vendor Type *
          </label>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="type"
                value="vendor"
                checked={formData.type === 'vendor'}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
              <span className="radio-label">Vendor</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="type"
                value="subcontractor"
                checked={formData.type === 'subcontractor'}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
              <span className="radio-label">Subcontractor</span>
            </label>
          </div>
          {errors.type && <span className="error-message">{errors.type}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="manager" className="form-label">
            <User size={20} />
            Manager *
          </label>
          <select
            id="manager"
            name="manager"
            value={formData.manager}
            onChange={handleInputChange}
            className={`form-input ${errors.manager ? 'error' : ''}`}
            disabled={isSubmitting}
          >
            <option value="">Select a manager</option>
            <option value="Anh Le">Anh Le</option>
            <option value="Andy">Andy</option>
            <option value="Juanito">Juanito</option>
            <option value="Goat">Goat</option>
          </select>
          {errors.manager && <span className="error-message">{errors.manager}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">
            <Package size={20} />
            Purpose
          </label>
          <div className="purpose-display">
            <CheckCircle size={16} />
            <span>Pickup Check</span>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="projects" className="form-label">
            <FolderOpen size={20} />
            What projects?
          </label>
          <input
            type="text"
            id="projects"
            name="projects"
            value={formData.projects}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Enter project names"
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding to Queue...' : 'Join Waiting List'}
        </button>
      </form>

      {showSuccess && (
        <div className="success-message">
          <CheckCircle size={20} />
          <span>Successfully added to waiting list!</span>
        </div>
      )}
    </div>
  );
};

export default CheckInForm;
