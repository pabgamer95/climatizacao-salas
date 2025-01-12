import { useState, useEffect } from 'react';

const useWarning = () => {
  const [dataW, setData] = useState([]);
  const [loadingW, setLoading] = useState(true);
  const [errorW, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8081/warning');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { dataW, loadingW, errorW, setData };
};

export default useWarning;