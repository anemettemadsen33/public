import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const RealTimeBidding = ({ vehicle, onBidPlaced }) => {
  const { t } = useTranslation();
  const [currentBid, setCurrentBid] = useState(vehicle.startingBid || vehicle.price);
  const [bidAmount, setBidAmount] = useState('');
  const [bids, setBids] = useState(() => {
    const initialTimestamp = new Date(Date.now() - 3600000);
    return [
      {
        id: 1,
        bidder: 'User123',
        amount: vehicle.startingBid || vehicle.price,
        timestamp: initialTimestamp,
      },
    ];
  });
  const [timeLeft, setTimeLeft] = useState(86400); // 24 hours in seconds
  const [isActive, setIsActive] = useState(true);

  // Countdown timer
  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  // Simulate real-time bids from other users
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      // Random chance of a new bid (20%)
      if (Math.random() < 0.2) {
        const increment = Math.floor(Math.random() * 500) + 100;
        const newBidAmount = currentBid + increment;
        const newBid = {
          id: Date.now(),
          bidder: `User${Math.floor(Math.random() * 999)}`,
          amount: newBidAmount,
          timestamp: new Date(),
        };
        setBids((prev) => [newBid, ...prev]);
        setCurrentBid(newBidAmount);
      }
    }, 15000); // Check every 15 seconds

    return () => clearInterval(interval);
  }, [currentBid, isActive]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlaceBid = (e) => {
    e.preventDefault();
    const amount = parseFloat(bidAmount);

    if (isNaN(amount) || amount <= currentBid) {
      alert(t('bidding.minimumBid', 'Your bid must be higher than the current bid'));
      return;
    }

    const newBid = {
      id: Date.now(),
      bidder: 'You',
      amount: amount,
      timestamp: new Date(),
      isYou: true,
    };

    setBids([newBid, ...bids]);
    setCurrentBid(amount);
    setBidAmount('');

    if (onBidPlaced) {
      onBidPlaced(newBid);
    }
  };

  const suggestedBids = [
    currentBid + 100,
    currentBid + 250,
    currentBid + 500,
    currentBid + 1000,
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('bidding.title', 'Live Auction')}
            </h2>
            {isActive && (
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {vehicle.make} {vehicle.model} • {vehicle.year}
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {t('bidding.timeLeft', 'Time Left')}
          </div>
          <div
            className={`text-2xl font-bold ${
              timeLeft < 3600 ? 'text-red-600' : 'text-gray-900 dark:text-white'
            }`}
          >
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Current Bid */}
      <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-lg p-6 mb-6">
        <div className="text-center">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {t('bidding.currentBid', 'Current Bid')}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBid}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="text-4xl font-bold text-primary-600 dark:text-primary-400"
            >
              ${currentBid.toLocaleString()}
            </motion.div>
          </AnimatePresence>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {bids.length} {t('bidding.bids', 'bids placed')}
          </div>
        </div>
      </div>

      {/* Bidding Form */}
      {isActive ? (
        <form onSubmit={handlePlaceBid} className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('bidding.placeBid', 'Place Your Bid')}
          </label>
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder={`Min: $${(currentBid + 1).toLocaleString()}`}
                min={currentBid + 1}
                step="50"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white text-lg font-semibold"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors"
            >
              {t('bidding.bid', 'Bid')}
            </button>
          </div>

          {/* Quick Bid Buttons */}
          <div className="grid grid-cols-4 gap-2 mt-3">
            {suggestedBids.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => setBidAmount(amount.toString())}
                className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
              >
                +${amount - currentBid}
              </button>
            ))}
          </div>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg text-center">
          <p className="text-yellow-800 dark:text-yellow-200 font-semibold">
            {t('bidding.ended', 'Auction Ended')}
          </p>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
            {t('bidding.winningBid', 'Winning bid')}: ${currentBid.toLocaleString()}
          </p>
        </div>
      )}

      {/* Bid History */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          {t('bidding.bidHistory', 'Bid History')}
        </h3>
        <div className="max-h-64 overflow-y-auto space-y-2">
          {bids.map((bid, index) => (
            <motion.div
              key={bid.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center justify-between p-3 rounded-lg ${
                bid.isYou
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700'
                  : 'bg-gray-50 dark:bg-gray-700/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    bid.isYou
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {bid.bidder.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {bid.bidder}
                    {bid.isYou && (
                      <span className="ml-2 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-0.5 rounded">
                        {t('bidding.you', 'You')}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {bid.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                ${bid.amount.toLocaleString()}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Auction Rules */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
          {t('bidding.rules', 'Auction Rules')}
        </h4>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <li>• {t('bidding.rule1', 'Minimum bid increment: $50')}</li>
          <li>• {t('bidding.rule2', 'All bids are binding and cannot be retracted')}</li>
          <li>• {t('bidding.rule3', 'Winner will be contacted within 24 hours')}</li>
          <li>• {t('bidding.rule4', 'Reserve price may apply')}</li>
        </ul>
      </div>
    </div>
  );
};

export default RealTimeBidding;
