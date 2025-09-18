# Check-in Waiting List App

A React-based waiting list management system similar to Yelp's check-in system, designed for vendors and subcontractors to manage pickup checks.

## Features

### Admin Dashboard (Main Interface - Default)
- **Complete Management**: Full control over all clients in the waiting list
- **Statistics Cards**: View counts for waiting, called, in-progress, and completed clients
- **Search & Filter**: Find clients by name, phone, or status
- **Call Client Button**: Click to show "Please come to Accounting Room" on public screen
- **Status Management**: Track clients through waiting → called → in-progress → completed
- **Complete Toggle**: Mark clients as complete (removes from public view)
- **Client Removal**: Remove clients from the list entirely
- **Open Check-in Page**: Button to access the public client interface

### Public Check-in Page (Client Interface)
- **Client Check-in Form**: Clients can input their name, phone number, and select their type (Vendor or Subcontractor)
- **Purpose**: Automatically set to "Pickup Check" as requested
- **Simplified Waiting List**: Shows only essential information for client confidentiality:
  - Client name only
  - Check-in time
  - Time waiting (e.g., "2h 15m ago")
  - Current status (waiting, called, in-progress)
- **Call Notifications**: Displays "Please come to Accounting Room" when staff calls a client
- **Form Validation**: Ensures all required fields are filled correctly
- **Privacy Protection**: Phone numbers and vendor types hidden from public view

### General Features
- **Power Automate Integration**: Automatic notifications sent to Teams via Power Automate when clients check in
- **SMS Notifications**: Automatic SMS messages sent to visitors when admin calls them (ready to pick up)
- **Dark/Light Mode**: Toggle between dark (default) and light themes
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Changes reflect immediately across all views
- **Navigation**: Easy switching between admin dashboard and public check-in page

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- Power Automate webhook URL (optional, for notifications)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up notifications (optional):
   - Copy `env.example` to `.env`
   - Teams webhook URL is already configured in the example file
   - For SMS notifications, add your SMS webhook URL:
        ```
        REACT_APP_SMS_WEBHOOK_URL=your_sms_webhook_url_here
        ```
   - You can use services like Twilio, AWS SNS, or any SMS API

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Usage

### For Staff (Admin Dashboard - Main Interface)
1. **Default View**: App opens to admin dashboard
2. View complete statistics and manage all clients
3. Use search and filters to find specific clients
4. **Call Client**: Click "Call Client" to show notification on public screen
5. **Start Service**: Click "Start Service" when client arrives
6. **Complete**: Click "Complete" to finish service (removes from public view)
7. **Remove**: Click the X button to remove clients entirely
8. **Open Check-in Page**: Click "Open Check-in Page" to show client interface

### For Clients (Public Check-in Page)
1. Staff opens the public check-in page from admin dashboard
2. Enter your full name
3. Enter your phone number
4. Select whether you're a Vendor or Subcontractor
5. Click "Join Waiting List" to be added to the queue
6. Wait for the "Please come to Accounting Room" notification
7. View your position in the queue with limited information:
   - Your name and queue position
   - Check-in time
   - How long you've been waiting
   - Your current status

### Workflow
1. **Staff**: Opens public check-in page for clients
2. **Client**: Checks in → Status: "Waiting"
3. **Staff**: Clicks "Call Client" → Shows "Please come to Accounting Room" on public screen
4. **Client**: Sees notification and goes to accounting room
5. **Staff**: Clicks "Start Service" → Status: "In Progress"
6. **Staff**: Clicks "Complete" → Client removed from public view

## Project Structure

```
src/
├── components/
│   ├── CheckInForm.js          # Check-in form component
│   ├── CheckInForm.css         # Form styling
│   ├── WaitingList.js          # Admin waiting list display (full details)
│   ├── WaitingList.css         # List styling
│   ├── PublicWaitingList.js    # Public waiting list (limited info only)
│   ├── PublicWaitingList.css   # Public list styling
│   ├── AdminPage.js            # Admin dashboard (main interface)
│   ├── AdminPage.css           # Admin styling
│   ├── PublicCheckIn.js        # Public check-in page
│   ├── PublicCheckIn.css       # Public page styling
│   ├── ThemeToggle.js          # Dark/light mode toggle
│   └── ThemeToggle.css         # Toggle styling
├── App.js                      # Main app component with view switching
├── App.css                     # App-wide styling
├── index.js                    # App entry point
└── index.css                   # Global styles
```

## Technologies Used

- React 18
- Lucide React (for icons)
- CSS3 with custom properties
- Responsive design principles

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is for internal use only.
