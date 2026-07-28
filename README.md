# Credit Card Benefit Tracker

A comprehensive web application to track and manage credit card benefits, helping you maximize the value of your premium credit cards.

## 🚀 Features

### 📱 Core Functionality
- **Multi-Card Management**: Add and manage multiple credit cards from major issuers
- **Benefit Tracking**: Track usage status of credits, subscriptions, and features
- **Smart Categorization**: Benefits organized by category (Travel, Dining, Entertainment, etc.)
- **Expiration Monitoring**: Visual indicators for benefit expiration dates
- **Multiple View Modes**: Card view, list view, and unused benefits only

### 💳 Supported Credit Cards
- **Chase**: Sapphire Reserve, Sapphire Preferred, United Quest, World of Hyatt, IHG One Rewards
- **American Express**: Platinum, Gold, Green, Business Platinum, Marriott Brilliant, Hilton Aspire, Delta Reserve
- **Capital One**: Venture X, Venture, Savor
- **Citi**: Prestige, Premier, AAdvantage Executive
- **Wells Fargo**: Autograph
- **Bank of America**: Premium Rewards

### 🔧 Benefit Types
- **Credits**: Annual, semi-annual, and monthly statement credits
- **Subscriptions**: Complimentary memberships (DoorDash, Uber, streaming services)
- **Features**: Lounge access, elite status, insurance coverage
- **One-time Benefits**: TSA PreCheck/Global Entry credits

### 🎨 User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Mode Support**: Automatic theme switching
- **Smooth Animations**: Enhanced UI with transitions and hover effects
- **Privacy-Focused**: All data stored locally in your browser

## 🛠️ Technology Stack

- **Frontend**: React 18 (via Babel), HTML5, CSS3
- **Styling**: Tailwind CSS with custom gradients
- **Storage**: Browser Local Storage
- **Fonts**: Inter from Google Fonts
- **Icons**: Emoji-based category icons

## 📦 Installation & Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3.x (for local development server)

### Quick Start
1. **Clone or download** the repository
2. **Navigate** to the project directory
3. **Start a local server**:
   ```bash
   cd CardBenefitTracker
   python3 -m http.server 8000
   ```
4. **Open your browser** and go to `http://localhost:8000`

### Alternative Setup
You can also open `index.html` directly in your browser, though a local server is recommended for the best experience.

## 🎯 Usage Guide

### Adding Your First Card
1. Click the **"Add Card"** button
2. Select from available premium credit cards
3. Choose your card and click **"Add Selected Cards"**

### Managing Benefits
- **Mark as Used**: Click "Mark Used" for statement credits
- **Subscribe**: Toggle subscription benefits on/off
- **View Features**: See active features like lounge access

### View Modes
- **Card View**: See all cards with their benefits in card layout
- **List View**: Tabular view of all benefits across cards
- **Unused Only**: Focus on benefits you haven't used yet

### Settings
- **Reset Benefit Usage**: Clear all usage states while keeping cards
- **Reset All Data**: Complete data wipe (cannot be undone)

## 📊 Benefit Categories

| Category | Icon | Examples |
|----------|------|----------|
| Travel | ✈️ | Flight credits, hotel credits, TSA PreCheck |
| Dining | 🍽️ | Restaurant credits, DoorDash benefits |
| Entertainment | 🎭 | Streaming subscriptions, event tickets |
| Shopping | 🛍️ | Retail credits, Instacart benefits |
| Rideshare | 🚗 | Uber/Lyft credits |
| Lounge | 🛋️ | Airport lounge access |
| Insurance | 🛡️ | Cell phone protection, travel insurance |

## 🔒 Privacy & Security

- **Local Storage Only**: No data sent to external servers
- **No Account Required**: No sign-up or personal information needed
- **Browser-Based**: Data persists until you clear browser data
- **Open Source**: Full transparency of code and functionality

## 🎨 Customization

### Color Schemes
The app uses custom gradients for different card issuers:
- **Chase**: Blue gradient (`card-gradient-chase`)
- **American Express**: Gray gradient (`card-gradient-amex`)
- **United/Other**: Light blue gradient (`card-gradient-united`)

### Adding New Cards
To add new cards, update the `availableCards` object in the main HTML file with:
- Card details (name, issuer, annual fee)
- Benefit definitions
- Color scheme

## 📱 Mobile Experience

The app is fully responsive and optimized for mobile use:
- Touch-friendly buttons and interfaces
- Readable text on small screens
- Collapsible navigation
- Optimized layouts for different screen sizes

## 🔄 Data Management

### Local Storage
- Data persists between browser sessions
- No external dependencies
- Instant loading and saving

### Reset Options
- **Benefit Usage Reset**: Keep cards, reset benefit states
- **Full Reset**: Remove all data and start fresh

## 🌟 Contributing

This is a client-side application with no backend requirements. To contribute:

1. Understand the codebase structure
2. Test changes locally
3. Ensure responsive design works across devices
4. Follow the existing code style and patterns

## 📝 File Structure

```
CardBenefitTracker/
├── index.html          # Main application file
├── css/
│   └── styles.css      # Custom styles and animations
├── js/
│   ├── data.js                 # 1. Card data definitions
│   ├── utils.js                # 2. Shared utilities
│   ├── cardfit-data.js         # 3. CardFit profile data
│   ├── cardfit-calculator.js   # 4. CardFit calculations
│   ├── cardfit-components.js   # 5. CardFit UI
│   ├── components.js           # 6. Tracker UI
│   └── app.js                  # 7. App shell and entry point
├── test.html           # Testing instructions
├── test-suite.html     # Test suite
└── README.md           # This file
```

## 🎯 Best Practices

### Maximizing Benefits
1. **Regular Review**: Check unused benefits monthly
2. **Expiration Awareness**: Pay attention to benefit expiration dates
3. **Category Optimization**: Focus on benefits in categories you use most
4. **Annual Planning**: Plan major purchases around benefit availability

### Data Management
- **Regular Backups**: Export/screenshot your data periodically
- **Benefit Tracking**: Update usage status promptly
- **Annual Reset**: Consider resetting benefit usage at year-end

## 🚨 Troubleshooting

### Common Issues
- **Data Not Saving**: Check if browser allows local storage
- **Cards Not Loading**: Ensure JavaScript is enabled
- **Styling Issues**: Clear browser cache and reload

### Browser Compatibility
- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **IE**: Not supported

## 📈 Future Enhancements

Potential features for future versions:
- **Export/Import**: Data backup and restore functionality
- **Notifications**: Benefit expiration reminders
- **Analytics**: Usage patterns and optimization suggestions
- **Custom Cards**: Add user-defined credit cards
- **Benefit Calendar**: Timeline view of benefits throughout the year

## 📜 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Credit card data compiled from official issuer websites
- Icons and styling inspired by modern card designs
- Built with modern web technologies for optimal performance

---

**Note**: This application is for personal finance management only. Always verify benefit details with your card issuer, as terms and conditions may change.
