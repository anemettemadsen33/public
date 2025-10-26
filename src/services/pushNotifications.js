// Push Notifications Service
// Handles push notification permissions and subscriptions for PWA

class PushNotificationService {
  constructor() {
    this.vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';
    this.subscription = null;
  }

  // Check if push notifications are supported
  isSupported() {
    return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
  }

  // Get current permission status
  getPermission() {
    if (!this.isSupported()) return 'unsupported';
    return Notification.permission;
  }

  // Request permission for push notifications
  async requestPermission() {
    if (!this.isSupported()) {
      throw new Error('Push notifications are not supported in this browser');
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  // Subscribe to push notifications
  async subscribe() {
    try {
      const permission = await this.requestPermission();
      
      if (permission !== 'granted') {
        throw new Error('Permission not granted for notifications');
      }

      // Wait for service worker to be ready
      const registration = await navigator.serviceWorker.ready;

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey),
      });

      this.subscription = subscription;
      
      // Send subscription to backend (in production)
      // await this.sendSubscriptionToServer(subscription);

      return subscription;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      throw error;
    }
  }

  // Unsubscribe from push notifications
  async unsubscribe() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
        // Remove subscription from backend (in production)
        // await this.removeSubscriptionFromServer(subscription);
        this.subscription = null;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      throw error;
    }
  }

  // Send notification (for demo purposes, uses local notification)
  async sendNotification(title, options = {}) {
    if (!this.isSupported()) {
      console.warn('Notifications not supported');
      return;
    }

    if (Notification.permission !== 'granted') {
      const permission = await this.requestPermission();
      if (permission !== 'granted') {
        console.warn('Notification permission denied');
        return;
      }
    }

    // For demo, use local notification
    // In production, this would be triggered by server push
    return new Notification(title, {
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      vibrate: [200, 100, 200],
      ...options,
    });
  }

  // Notify user about new matching vehicle
  async notifyNewVehicleMatch(vehicle) {
    return this.sendNotification('New Vehicle Match!', {
      body: `${vehicle.make} ${vehicle.model} - $${vehicle.price.toLocaleString()}`,
      icon: vehicle.image || '/icon-192x192.png',
      tag: `vehicle-${vehicle.id}`,
      data: { vehicleId: vehicle.id, url: `/vehicle/${vehicle.id}` },
    });
  }

  // Notify about price drop
  async notifyPriceDrop(vehicle, oldPrice, newPrice) {
    return this.sendNotification('Price Drop Alert!', {
      body: `${vehicle.make} ${vehicle.model} reduced from $${oldPrice.toLocaleString()} to $${newPrice.toLocaleString()}`,
      icon: vehicle.image || '/icon-192x192.png',
      tag: `price-drop-${vehicle.id}`,
      data: { vehicleId: vehicle.id, url: `/vehicle/${vehicle.id}` },
    });
  }

  // Notify about new message from dealer
  async notifyNewMessage(dealerName, message) {
    return this.sendNotification(`New message from ${dealerName}`, {
      body: message.substring(0, 100),
      tag: 'new-message',
      data: { url: '/messages' },
    });
  }

  // Helper function to convert VAPID key
  urlBase64ToUint8Array(base64String) {
    if (!base64String) {
      // Default public key for demo
      return new Uint8Array();
    }

    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Send subscription to server (placeholder for production)
  async sendSubscriptionToServer(_subscription) {
    // In production, send to backend API
    // await axios.post('/api/push/subscribe', subscription);
    if (process.env.NODE_ENV === 'development') {
      console.warn('Subscription would be sent to server');
    }
  }

  // Remove subscription from server (placeholder for production)
  async removeSubscriptionFromServer(_subscription) {
    // In production, remove from backend API
    // await axios.post('/api/push/unsubscribe', subscription);
    if (process.env.NODE_ENV === 'development') {
      console.warn('Subscription would be removed from server');
    }
  }
}

// Export singleton instance
export const pushNotificationService = new PushNotificationService();

export default pushNotificationService;
