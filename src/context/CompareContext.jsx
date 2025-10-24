import { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext();

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within CompareProvider');
  }
  return context;
};

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState(() => {
    const saved = localStorage.getItem('compareList');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('compareList', JSON.stringify(compareList));
  }, [compareList]);

  const addToCompare = (vehicle) => {
    if (compareList.length >= 3) {
      console.warn('You can compare up to 3 vehicles');
      return false;
    }
    if (compareList.find(v => v.id === vehicle.id)) {
      console.warn('Vehicle already in comparison list');
      return false;
    }
    setCompareList([...compareList, vehicle]);
    return true;
  };

  const removeFromCompare = (vehicleId) => {
    setCompareList(compareList.filter(v => v.id !== vehicleId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isInCompare = (vehicleId) => {
    return compareList.some(v => v.id === vehicleId);
  };

  return (
    <CompareContext.Provider value={{
      compareList,
      addToCompare,
      removeFromCompare,
      clearCompare,
      isInCompare
    }}>
      {children}
    </CompareContext.Provider>
  );
};
