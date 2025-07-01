const handleCoinSelect = (id) => {
    setLoading(true);
    const selected = coins.find(coin => coin.id === id);
    setSelectedCoin(selected);
  
    // Fetch historical data for the selected date range
    const promises = [];
    const date = new Date(startDate);
    while (date <= endDate) {
      const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  
      const promise = axios.get(`http://localhost:3001/api/v3/coins/${id}/history?date=${formattedDate}`, {
        headers: {
          'X-CoinAPI-Key': api_key
        }
      })
        .then(response => {
          const price = response.data.market_data.current_price.usd;
          return [Date.parse(formattedDate), price];
        })
        .catch(error => {
          console.error('Error fetching historical data', error);
          return [Date.parse(formattedDate), 0]; // Return a default value
        });
  
      promises.push(promise);
      date.setDate(date.getDate() + 1); // Increment the date
    }
  
    Promise.all(promises)
      .then(history => {
        setHistory(history);
        setLoading(false);
      });
  };