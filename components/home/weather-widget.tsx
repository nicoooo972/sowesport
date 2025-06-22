"use client";

import { useState, useEffect } from "react";
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Droplets, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  location: string;
}

interface WeatherWidgetProps {
  className?: string;
  location?: string;
}

export default function WeatherWidget({ 
  className = "",
  location = "Paris"
}: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWeatherData();
    const interval = setInterval(fetchWeatherData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [location]);

  const fetchWeatherData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockWeatherData: WeatherData = {
        temperature: Math.round(Math.random() * 25 + 5),
        condition: getRandomCondition(),
        humidity: Math.round(Math.random() * 40 + 40),
        windSpeed: Math.round(Math.random() * 20 + 5),
        visibility: Math.round(Math.random() * 5 + 5),
        location: location
      };

      setWeather(mockWeatherData);
    } catch (err) {
      setError("Impossible de charger la météo");
    } finally {
      setIsLoading(false);
    }
  };

  const getRandomCondition = (): string => {
    const conditions = ["Ensoleillé", "Partiellement nuageux", "Nuageux", "Pluvieux", "Brumeux"];
    return conditions[Math.floor(Math.random() * conditions.length)];
  };

  const getWeatherIcon = (condition: string) => {
    const lower = condition.toLowerCase();
    
    if (lower.includes("ensoleillé")) return <Sun className="h-8 w-8 text-yellow-500" />;
    if (lower.includes("pluie")) return <CloudRain className="h-8 w-8 text-blue-500" />;
    if (lower.includes("neige")) return <CloudSnow className="h-8 w-8 text-gray-300" />;
    if (lower.includes("nuageux")) return <Cloud className="h-8 w-8 text-gray-500" />;
    
    return <Sun className="h-8 w-8 text-yellow-500" />;
  };

  const getTemperatureColor = (temp: number): string => {
    if (temp < 0) return "text-blue-600";
    if (temp < 10) return "text-blue-500";
    if (temp < 20) return "text-green-500";
    if (temp < 30) return "text-yellow-500";
    return "text-red-500";
  };

  const getGradientBackground = (condition: string): string => {
    const lower = condition.toLowerCase();
    
    if (lower.includes("ensoleillé")) {
      return "from-yellow-100 to-orange-100 dark:from-yellow-950/20 dark:to-orange-950/20";
    }
    if (lower.includes("pluie")) {
      return "from-blue-100 to-indigo-100 dark:from-blue-950/20 dark:to-indigo-950/20";
    }
    if (lower.includes("nuageux")) {
      return "from-gray-100 to-slate-100 dark:from-gray-950/20 dark:to-slate-950/20";
    }
    
    return "from-sky-100 to-blue-100 dark:from-sky-950/20 dark:to-blue-950/20";
  };

  if (isLoading) {
    return (
      <Card className={`bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/20 dark:to-blue-950/20 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <div className="text-center mb-4">
            <Skeleton className="h-12 w-16 mx-auto mb-2" />
            <Skeleton className="h-4 w-24 mx-auto" />
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card className={`bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 ${className}`}>
        <CardContent className="p-4 text-center">
          <Cloud className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">{error || "Données météo indisponibles"}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`bg-gradient-to-br ${getGradientBackground(weather.condition)} border-0 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-sm">{weather.location}</h3>
            <p className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString('fr-FR', { 
                weekday: 'short', day: 'numeric', month: 'short'
              })}
            </p>
          </div>
          <Badge variant="outline" className="text-xs">Live</Badge>
        </div>

        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            {getWeatherIcon(weather.condition)}
            <span className={`text-3xl font-bold ${getTemperatureColor(weather.temperature)}`}>
              {weather.temperature}°
            </span>
          </div>
          <p className="text-sm text-muted-foreground font-medium">{weather.condition}</p>
        </div>

        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Droplets className="h-3 w-3 text-blue-500" />
              <span className="font-medium">{weather.humidity}%</span>
            </div>
            <p className="text-muted-foreground">Humidité</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Wind className="h-3 w-3 text-green-500" />
              <span className="font-medium">{weather.windSpeed} km/h</span>
            </div>
            <p className="text-muted-foreground">Vent</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Eye className="h-3 w-3 text-purple-500" />
              <span className="font-medium">{weather.visibility} km</span>
            </div>
            <p className="text-muted-foreground">Visibilité</p>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-white/20 dark:border-black/20">
          <p className="text-xs text-muted-foreground text-center">
            Mis à jour il y a quelques instants
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 