# Market Climber 📈

A real-time stock market visualization tool that displays market movers in an engaging and interactive way.

![Market Climber Preview](public/android-chrome-192x192.png)

## Features

### Real-Time Market Data
- Live tracking of market gainers and losers
- Integration with Alpha Vantage API
- Automatic data refresh
- Detailed stock information and charts

### Interactive Visualizations
- **Gainers Stairs** 🏃‍♂️: Ascending staircase visualization for top gaining stocks
- **Losers Elevator** 🔻: Elevator-style display for declining stocks
- Interactive stock panels with detailed information
- Responsive and animated UI elements

### Technical Features
- Real-time data updates
- Responsive design for all devices
- Dark mode optimized interface
- Interactive charts and graphs
- Smooth animations and transitions

## Technology Stack

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: 
  - Tailwind CSS for utility-first styling
  - shadcn-ui for component library
- **Data Visualization**: Recharts
- **State Management**: React Query
- **API Integration**: Alpha Vantage API

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- Alpha Vantage API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/MikeWayne92/market-climber-ascend-descend.git
```

2. Navigate to project directory:
```bash
cd market-climber-ascend-descend
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

1. **View Market Movers**:
   - See top gainers in an ascending staircase visualization
   - View top losers in an elevator-style display
   - Toggle between different views using the tab system

2. **Interact with Stocks**:
   - Click on any stock to view detailed information
   - View price charts and key statistics
   - Monitor real-time price changes

3. **Customize Views**:
   - Switch between different timeframes
   - Toggle between full and split views
   - Access detailed stock information panels

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Alpha Vantage](https://www.alphavantage.co/) for providing market data API
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
