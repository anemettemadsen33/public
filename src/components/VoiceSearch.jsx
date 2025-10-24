import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const VoiceSearch = ({ onSearch }) => {
  const { t } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    // Check if browser supports Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsListening(true);
      };

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        onSearch(transcript);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const toggleListening = () => {
    if (!recognition) {
      alert('Voice search is not supported in your browser');
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      setTranscript('');
      recognition.start();
    }
  };

  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    return null; // Don't show if not supported
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleListening}
        className={`p-2 rounded-lg transition-all ${
          isListening 
            ? 'bg-red-500 text-white animate-pulse' 
            : 'bg-primary-600 text-white hover:bg-primary-700'
        }`}
        title={isListening ? 'Listening...' : 'Voice Search'}
      >
        {isListening ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
      </button>
      {transcript && (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          "{transcript}"
        </span>
      )}
    </div>
  );
};

export default VoiceSearch;
