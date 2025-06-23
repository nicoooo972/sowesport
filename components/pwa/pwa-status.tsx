'use client';

import { Smartphone, Monitor, Wifi, WifiOff } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { Badge } from '@/components/ui/badge';

export function PWAStatus() {
  const { isInstalled, isStandalone, isOnline } = usePWA();

  return (
    <div className="flex items-center space-x-2 text-xs">
      {/* Installation Status */}
      {isInstalled ? (
        <Badge variant="default" className="bg-green-500/20 text-green-700 dark:text-green-400">
          <Smartphone className="h-3 w-3 mr-1" />
          Installée
        </Badge>
      ) : (
        <Badge variant="outline">
          <Monitor className="h-3 w-3 mr-1" />
          Web
        </Badge>
      )}

      {/* Connection Status */}
      {isOnline ? (
        <Badge variant="outline" className="text-blue-600 dark:text-blue-400">
          <Wifi className="h-3 w-3 mr-1" />
          En ligne
        </Badge>
      ) : (
        <Badge variant="destructive">
          <WifiOff className="h-3 w-3 mr-1" />
          Hors ligne
        </Badge>
      )}
    </div>
  );
} 