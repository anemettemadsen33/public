import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Video Upload and Preview Component
 * Allows dealers to upload video tours of vehicles
 * Supports live video chat preview with customers
 */
const VideoListings = ({ vehicleId, dealerId, onVideoUploaded }) => {
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isVideoChatOpen, setIsVideoChatOpen] = useState(false);
  const [videoChatStatus, setVideoChatStatus] = useState('idle'); // idle, connecting, connected, ended
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);

  /**
   * Handle video file upload
   */
  const handleVideoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      alert('Please select a valid video file');
      return;
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      alert('Video file is too large. Maximum size is 100MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const formData = new FormData();
      formData.append('video', file);
      formData.append('vehicleId', vehicleId);
      formData.append('dealerId', dealerId);

      // Mock upload with progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        setUploadProgress(i);
      }

      // In production, use actual API call:
      // const response = await fetch('/api/videos/upload', {
      //   method: 'POST',
      //   body: formData,
      //   onUploadProgress: (progressEvent) => {
      //     const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      //     setUploadProgress(progress);
      //   }
      // });
      
      // Create local URL for preview
      const url = URL.createObjectURL(file);
      setVideoUrl(url);

      if (onVideoUploaded) {
        onVideoUploaded({ url, file });
      }

      setUploadProgress(100);
    } catch (error) {
      console.error('Video upload error:', error);
      alert('Failed to upload video. Please try again.');
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 1000);
    }
  };

  /**
   * Start video chat preview
   */
  const startVideoChat = async () => {
    setVideoChatStatus('connecting');

    try {
      // Request camera and microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;

      // Display local stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // In production, establish WebRTC connection
      // setupPeerConnection();

      setVideoChatStatus('connected');
      setIsVideoChatOpen(true);

      // Auto-end after 1 minute (demo)
      setTimeout(() => {
        endVideoChat();
      }, 60000); // 60 seconds
    } catch (error) {
      console.error('Video chat error:', error);
      alert('Failed to start video chat. Please check camera permissions.');
      setVideoChatStatus('idle');
    }
  };

  /**
   * End video chat
   */
  const endVideoChat = () => {
    // Stop all tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    setVideoChatStatus('ended');
    setTimeout(() => {
      setIsVideoChatOpen(false);
      setVideoChatStatus('idle');
    }, 2000);
  };

  /**
   * Setup WebRTC peer connection (production implementation)
   */
  const setupPeerConnection = () => {
    // WebRTC configuration
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        // Add TURN servers for production
      ],
    };

    const peerConnection = new RTCPeerConnection(configuration);
    peerConnectionRef.current = peerConnection;

    // Add local stream tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStreamRef.current);
      });
    }

    // Handle incoming tracks
    peerConnection.ontrack = (event) => {
      // Display remote stream
      console.log('Received remote track:', event);
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        // Send candidate to remote peer via signaling server
        console.log('ICE candidate:', event.candidate);
      }
    };
  };

  return (
    <div className="video-listings-container">
      {/* Video Upload Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          📹 {t('video.uploadTitle') || 'Video Tour'}
        </h3>

        {/* Upload Button */}
        {!videoUrl && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {isUploading ? (
                <span>Uploading... {uploadProgress}%</span>
              ) : (
                <span>{t('video.uploadButton') || 'Upload Video Tour'}</span>
              )}
            </button>

            {isUploading && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-red-600 to-pink-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                  Uploading video... Please wait
                </p>
              </div>
            )}
          </div>
        )}

        {/* Video Preview */}
        {videoUrl && (
          <div className="space-y-4">
            <video
              controls
              className="w-full rounded-lg shadow-lg"
              src={videoUrl}
            >
              Your browser does not support the video tag.
            </video>
            <button
              onClick={() => {
                URL.revokeObjectURL(videoUrl);
                setVideoUrl(null);
              }}
              className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Remove Video
            </button>
          </div>
        )}

        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          ℹ️ {t('video.uploadHint') || 'Upload a video tour to showcase your vehicle (max 100MB, MP4/MOV/WebM)'}
        </p>
      </div>

      {/* Video Chat Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          🎥 {t('video.chatTitle') || 'Live Video Preview'}
        </h3>

        {!isVideoChatOpen && videoChatStatus === 'idle' && (
          <div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t('video.chatDescription') || 'Request a 1-minute live video call with the dealer to see the vehicle in real-time.'}
            </p>
            <button
              onClick={startVideoChat}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>{t('video.startChat') || 'Start Live Preview (1 min)'}</span>
            </button>
          </div>
        )}

        {videoChatStatus === 'connecting' && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Connecting to dealer... Please wait
            </p>
          </div>
        )}

        {isVideoChatOpen && videoChatStatus === 'connected' && (
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                <span className="animate-pulse">●</span> LIVE
              </div>
              <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg text-sm">
                1:00 remaining
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={endVideoChat}
                className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                End Call
              </button>
            </div>
          </div>
        )}

        {videoChatStatus === 'ended' && (
          <div className="text-center py-8">
            <svg className="w-16 h-16 mx-auto text-green-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Video call ended
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Thank you for using our live preview feature!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoListings;
