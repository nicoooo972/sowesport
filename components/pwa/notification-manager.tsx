'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, BellOff } from 'lucide-react';

export function NotificationManager() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    setIsSupported('Notification' in window);
    
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) return;

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        // Register for push notifications
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready;
          
          // Check if push messaging is supported
          if ('PushManager' in window) {
            // Here you would typically subscribe to push notifications
            // with your push service (Firebase, etc.)
            console.log('Push notifications are supported');
          }
        }
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const showTestNotification = () => {
    if (permission === 'granted') {
      new Notification('SowEsport Test', {
        body: 'Les notifications fonctionnent parfaitement !',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
      });
    }
  };

  if (!isSupported) return null;

  return (
    <div className="flex items-center space-x-2">
      {permission === 'default' && (
        <Button variant="outline" size="sm" onClick={requestPermission}>
          <Bell className="h-4 w-4 mr-2" />
          Activer les notifications
        </Button>
      )}
      
      {permission === 'granted' && (
        <Button variant="outline" size="sm" onClick={showTestNotification}>
          <Bell className="h-4 w-4 mr-2" />
          Test notification
        </Button>
      )}
      
      {permission === 'denied' && (
        <div className="flex items-center text-sm text-muted-foreground">
          <BellOff className="h-4 w-4 mr-2" />
          Notifications désactivées
        </div>
      )}
    </div>
  );
} 