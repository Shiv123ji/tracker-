import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';
import NewsTicker from './components/News';

function CoinDetails({ coin, history }) {
  const chartData = history.map(dataPoint => ({ date: new Date(dataPoint[0]).toDateString(), price: dataPoint[1] }));
  const priceChangeColor = coin.price_change_24h < 0 ? 'red' : 'green';

  return (
    <div className="coin-details">
      <h2>{coin.name} ({coin.symbol.toUpperCase()})</h2>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
        <span style={{ color: priceChangeColor, fontSize: '0.8em' }}>
          {coin.price_change_24h > 0 && '+'}{coin.price_change_24h?.toFixed(2)}%
        </span>
        <p style={{ fontSize: '2em', margin: 0 }}>
          Current Price: ${coin.current_price?.toFixed(2)}
        </p>
      </div>
      <h2>Historical Data</h2>
      <LineChart width={500} height={300} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </div>
  );
}

const holdingsData = [
  { id: 'bitcoin', symbol: 'BTC', amount: 0.5, cost_basis: 30000 },
  { id: 'ethereum', symbol: 'ETH', amount: 2, cost_basis: 1500 },
];

function App() {
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const holdings = useMemo(() => holdingsData, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  useEffect(() => {
    // This call will now be proxied to your backend at http://localhost:5000/api/price
    axios.get('/api/price')
      .then(response => {
        const updatedHoldings = holdings.map(holding => {
          const coin = response.data.find(coin => coin.id === holding.id);
          return {
            ...holding,
            name: coin.name,
            current_price: coin.current_price,
            price_change_24h: coin.price_change_24h,
            price_change_percentage_24h: coin.price_change_percentage_24h
          };
        });
        setCoins(updatedHoldings);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data from backend:', error);
      });
  }, [holdings]);

  const handleCoinSelect = (id) => {
    setLoading(true);
    const selected = coins.find(coin => coin.id === id);
    setSelectedCoin(selected);
  
    const promises = [];
    const date = new Date(startDate);
    while (date <= endDate) {
      const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  
      // This call will also be proxied to your backend
      const promise = axios.get(`/api/v3/coins/${id}/history?date=${formattedDate}`)
        .then(response => {
          const price = response.data.market_data.current_price.usd;
          return [Date.parse(formattedDate), price];
        })
        .catch(error => {
          console.error('Error fetching historical data from backend:', error);
          return [Date.parse(formattedDate), 0];
        });
  
      promises.push(promise);
      date.setDate(date.getDate() + 1);
    }
  
    Promise.all(promises)
      .then(history => {
        setHistory(history);
        setLoading(false);
      });
  };

  const totalValue = coins.reduce((total, coin) => total + (coin.current_price * coin.amount), 0);
  const totalInvested = coins.reduce((total, coin) => total + coin.cost_basis, 0);
  const roi = ((totalValue - totalInvested) / totalInvested) * 100;
  const pnl = totalValue - totalInvested;

  return (
    <div className="App">
      <header className="App-header">
        <NewsTicker />
        <h1>Crypto Dashboard</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100vh' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '100%' }}>
              <div style={{ flex: 1, border: '1px solid black', margin: '10px', padding: '20px', borderRadius: '10px', boxSizing: 'border-box' }}>
                <h2>Portfolio Tracker</h2>
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={coins}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {
                        coins.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                      }
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <h3>Holdings</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Coin</th>
                      <th>Amount</th>
                      <th>Current Value</th>
                      <th>24h Change $</th>
                      <th>24h Change %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coins.map((coin, index) => (
                      <tr key={index}>
                        <td>{coin.name}</td>
                        <td>{coin.amount}</td>
                        <td>${(coin.current_price * coin.amount).toFixed(2)}</td>
                        <td>{coin.price_change_24h?.toFixed(2)}</td>
                        <td>{coin.price_change_percentage_24h?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <h3>Total Portfolio Value: ${totalValue.toFixed(2)}</h3>
                <h3>ROI: {roi.toFixed(2)}%</h3>
                <h3>P&L: ${pnl.toFixed(2)}</h3>
              </div>
              <div style={{ flex: 1, border: '1px solid black', margin: '10px', padding: '20px', borderRadius: '10px', boxSizing: 'border-box' }}>
                <h2>Trends</h2>
                <select value={selectedCoin ? selectedCoin.id : ''} onChange={e => handleCoinSelect(e.target.value)}>
                  {coins.map(coin => (
                    <option key={coin.id} value={coin.id}>{coin.name} ({coin.symbol.toUpperCase()})</option>
                  ))}
                </select>
                <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
                <DatePicker selected={endDate} onChange={date => setEndDate(date)} />
                {selectedCoin && <CoinDetails coin={selectedCoin} history={history} />}
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
