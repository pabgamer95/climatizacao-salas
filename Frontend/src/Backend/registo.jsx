import { useState, useEffect } from 'react';

const useRegisto = () => {
  const [dataRegisto, setDataRegisto] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorRegisto, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8081/registo');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setDataRegisto(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { dataRegisto, loading, errorRegisto, setDataRegisto };
};

export default useRegisto;