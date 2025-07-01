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


export default App;