const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']; // add more colors if you have more coins

  useEffect(() => {
    axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${holdings.map(holding => holding.id).join(',')}`, {
      headers: {
        'X-CoinAPI-Key': api_key
      }
    })
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
        console.error('Error fetching data', error);
      });
  }, [holdings]);