# Tour Expense Splitter

A comprehensive, offline-first web application for managing and splitting expenses during group travel. Track shared costs, visualize spending patterns, and generate detailed reports with automatic settlement calculations.

## 🌟 Features

### Core Functionality
- **Tour Management**: Create and manage multiple tours with custom names and descriptions
- **Member Management**: Add group members with contact information
- **Expense Tracking**: Log expenses with flexible participant selection and categorization
- **Real-time Balance Calculations**: Automatic splitting with settlement recommendations
- **Offline-First**: All data stored locally, works without internet connection

### Visual Analytics
- **Interactive Dashboard**: Real-time statistics with hotel and transport cost breakdowns
- **Category Breakdown Chart**: Pie chart showing expense distribution by category
- **Daily Spending Chart**: Line chart tracking daily expenses over time
- **Auto-updating Charts**: Visual data updates immediately when expenses change

### Export & Reporting
- **PDF Export**: Optimized reports with embedded charts and comprehensive data
- **Excel Export**: Multi-sheet spreadsheets with detailed breakdowns
- **Settlement Recommendations**: Minimum transaction suggestions for group payback

### Smart Calculations
- **Day-wise Tracking**: Separate daily calculations (excluding hotel/transport)
- **Overall Totals**: Dashboard includes all expenses for complete overview
- **Flexible Participation**: Each expense can include different group members
- **Optimized Settlements**: Algorithm minimizes number of transactions needed

## 🚀 Getting Started

### Quick Start
1. Open the application in any modern web browser
2. The app loads with sample Bangkok trip data for demonstration
3. Explore the dashboard to see charts and statistics
4. Navigate through tabs to view different features
5. Add your own expenses to see real-time updates
6. Export reports when ready to share with group

### Creating a New Tour
1. Click "New Tour" button in the header
2. Enter tour name and description
3. Add group members with their contact information
4. Start logging expenses as they occur
5. Monitor balances and settlements in real-time

### Adding Expenses
1. Go to "Expenses" tab
2. Click "Add Expense" button
3. Fill in details:
   - Who paid
   - Amount
   - Date
   - Category
   - Description
   - Select participants
4. Save to update all calculations automatically

## 📊 Dashboard Overview

### Statistics Cards
- **Total Expenses**: Sum of all tour expenses
- **Hotel Cost**: Dedicated hotel expense tracking
- **Transport Cost**: Separate transportation expense total

### Interactive Charts
- **Category Breakdown**: Visual distribution of spending by category
- **Daily Spending**: Timeline view of daily expenses (excludes hotel/transport)

## 🧮 Balance & Settlement System

### How It Works
- **Simple Formula**: Final Balance = Total Paid - Total Share
- **Smart Splitting**: Expenses split only among participants
- **Settlement Algorithm**: Calculates minimum transactions needed
- **Real-time Updates**: Balances update instantly with each expense

### Settlement Features
- Who owes money and how much
- Who should receive money
- Optimized transaction suggestions
- Clear balance indicators (green = owed, red = owing)

## 📁 Directory Structure

```
tour-expense-splitter/
├── index.html              # Main HTML file with app structure
├── style.css               # Complete CSS styling and responsive design
├── app.js                  # Core JavaScript application logic
├── README.md               # This documentation file
└── assets/
    ├── libraries/
    │   ├── jspdf.umd.min.js        # PDF generation library
    │   ├── jspdf.plugin.autotable.min.js  # PDF table plugin
    │   ├── chart.umd.js            # Chart.js for visualizations
    │   └── xlsx.full.min.js        # Excel export library
    └── sample-data/
        └── bangkok-tour.json       # Sample tour data for demo
```

### File Descriptions

#### `index.html`
- Main application structure and layout
- CDN links for external libraries (jsPDF, Chart.js, XLSX)
- Tab-based navigation system
- Modal dialogs for forms
- Export buttons and tour selector

#### `style.css`
- Complete responsive design system
- Modern color scheme and typography
- Mobile-first approach with touch-friendly controls
- Chart container styling
- Modal and form styling

#### `app.js`
- Core application class (`TourExpenseSplitter`)
- Data management with localStorage persistence
- Real-time calculation engine
- Chart.js integration for visualizations
- PDF and Excel export functionality
- Event handling and user interactions

## 🎨 Design Philosophy

### Mobile-First Responsive Design
- Touch-friendly interface optimized for mobile devices
- Responsive tables that adapt to screen sizes
- Swipeable tabs and gesture-friendly controls
- Optimized forms for mobile input

### Offline-First Architecture
- No server dependencies or internet requirements
- Complete functionality works offline
- Data persists locally using browser storage
- Progressive Web App capabilities

### User Experience Focus
- Intuitive navigation with clear visual hierarchy
- Real-time feedback for all user actions
- Error handling with helpful messages
- Consistent design patterns throughout

## 🔧 Technical Implementation

### Technology Stack
- **Frontend**: Pure HTML5, CSS3, and Vanilla JavaScript
- **Charts**: Chart.js v4.4.0 for interactive visualizations
- **PDF Export**: jsPDF v2.5.1 with autoTable plugin
- **Excel Export**: SheetJS (xlsx) v0.18.5
- **Storage**: Browser localStorage for data persistence

### Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Mobile browsers (iOS Safari, Android Chrome)

### Performance Optimizations
- Efficient DOM manipulation
- Optimized chart rendering
- Compressed PDF generation
- Minimal external dependencies

## 📋 Usage Examples

### Basic Expense Entry
```javascript
// Example expense object structure
{
  id: "exp_001",
  date: "2025-07-20",
  description: "Group Dinner",
  amount: 2500,
  category: "Food",
  paidBy: "member_001",
  participants: ["member_001", "member_002", "member_003"],
  isHotelOrTransport: false
}
```

### Tour Data Structure
```javascript
// Example tour object
{
  id: "tour_001",
  name: "Bangkok Adventure 2025",
  description: "5-day group trip",
  startDate: "2025-07-20",
  endDate: "2025-07-24",
  members: [...],
  expenses: [...]
}
```

## 🎯 Use Cases

### Perfect For
- **Group Travel**: Friends, family, or colleagues traveling together
- **Event Planning**: Shared costs for parties, weddings, or gatherings
- **Roommate Expenses**: Shared household costs and utilities
- **Team Activities**: Office outings, team building events
- **Club Activities**: Group purchases and shared expenses

### Key Benefits
- **Transparency**: Everyone sees exactly what was spent and by whom
- **Fairness**: Automatic calculations ensure equitable cost sharing
- **Convenience**: No manual calculations or spreadsheet maintenance
- **Accessibility**: Works on any device with a web browser
- **Privacy**: All data stays on your device, no cloud storage required

## 🚀 Advanced Features

### Export Capabilities
- **PDF Reports**: Professional-looking reports with charts and tables
- **Excel Spreadsheets**: Multiple sheets with detailed breakdowns
- **Chart Images**: High-quality chart exports for presentations
- **Data Backup**: JSON export for data portability

### Customization Options
- **Expense Categories**: Customizable categories for different expense types
- **Date Ranges**: Flexible date handling for trips of any length
- **Member Management**: Add/remove members as group composition changes
- **Settlement Preferences**: Different settlement calculation methods

## 🔒 Privacy & Security

### Data Handling
- **Local Storage Only**: No data transmitted to external servers
- **No Registration Required**: Use immediately without creating accounts
- **Device-Specific**: Data remains on the device where it was created
- **User Control**: Complete control over data export and sharing

### Security Features
- **Client-Side Processing**: All calculations performed locally
- **No Network Dependencies**: Core functionality works completely offline
- **Data Validation**: Input validation prevents data corruption
- **Error Recovery**: Graceful handling of storage errors

## 🛠️ Development

### Code Organization
- **Modular Design**: Clear separation of concerns
- **ES6+ Features**: Modern JavaScript with classes and modules
- **Event-Driven Architecture**: Reactive user interface updates
- **Error Handling**: Comprehensive error catching and user feedback

### Extensibility
- **Plugin Architecture**: Easy to add new export formats
- **Theme System**: Customizable styling and color schemes
- **Chart Types**: Expandable visualization options
- **Storage Backends**: Adaptable to different storage mechanisms

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs or suggest features
- Submit pull requests for improvements
- Share usage feedback and suggestions
- Help improve documentation

## 📞 Support

For questions, issues, or feature requests:
- Create an issue in the project repository
- Check the documentation for common solutions
- Review the code examples and usage patterns

---

**Tour Expense Splitter** - Making group expense management simple, transparent, and fair.

Made with ❤️ by Momen in a Train from Cox's Bazar to Dhaka