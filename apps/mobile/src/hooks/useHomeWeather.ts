import React from 'react';

type WeatherState = {
  location: string;
  temperature: string;
  condition: string;
  icon: string;
};

const FALLBACK_WEATHER: WeatherState = {
  location: 'Your area',
  temperature: '--°',
  condition: 'Weather unavailable',
  icon: '🌤️',
};

const DEFAULT_COORDINATES = {
  latitude: 39.8283,
  longitude: -98.5795,
  location: 'Your area',
};

type Coordinates = {
  latitude: number;
  longitude: number;
  location: string;
};

const weatherCodeToCondition = (code: number): string => {
  if (code === 0) {
    return 'Clear';
  }
  if (code === 1 || code === 2) {
    return 'Partly cloudy';
  }
  if (code === 3) {
    return 'Overcast';
  }
  if (code === 45 || code === 48) {
    return 'Fog';
  }
  if ([51, 53, 55, 56, 57].includes(code)) {
    return 'Drizzle';
  }
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return 'Rain';
  }
  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return 'Snow';
  }
  if ([95, 96, 99].includes(code)) {
    return 'Thunderstorm';
  }

  return 'Weather update';
};

const conditionToIcon = (condition: string): string => {
  const lower = condition.toLowerCase();

  if (lower.includes('thunder')) {
    return '⛈️';
  }
  if (lower.includes('rain') || lower.includes('drizzle')) {
    return '🌧️';
  }
  if (lower.includes('snow')) {
    return '❄️';
  }
  if (lower.includes('fog')) {
    return '🌫️';
  }
  if (lower.includes('overcast') || lower.includes('cloud')) {
    return '☁️';
  }
  if (lower.includes('clear') || lower.includes('sun')) {
    return '☀️';
  }

  return '🌤️';
};

const formatTemperatureF = (tempF: unknown): string => {
  const parsed = Number(tempF);
  if (!Number.isFinite(parsed)) {
    return '--°';
  }
  return `${Math.round(parsed)}°F`;
};

const getCoordinates = async (): Promise<Coordinates> => {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    return DEFAULT_COORDINATES;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          location: 'Your area',
        });
      },
      () => resolve(DEFAULT_COORDINATES),
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 10 * 60 * 1000,
      },
    );
  });
};

const getLocationLabel = async (
  latitude: number,
  longitude: number,
  signal: AbortSignal,
): Promise<string> => {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&count=1&language=en&format=json`,
      { signal },
    );

    if (!response.ok) {
      return 'Your area';
    }

    const payload = (await response.json()) as {
      results?: Array<{ name?: string; admin1?: string }>;
    };

    const first = payload.results?.[0];
    if (!first) {
      return 'Your area';
    }

    if (first.admin1 && first.name && first.admin1 !== first.name) {
      return `${first.name}, ${first.admin1}`;
    }

    return first.name ?? 'Your area';
  } catch {
    return 'Your area';
  }
};

export const useHomeWeather = () => {
  const [weather, setWeather] = React.useState<WeatherState>(FALLBACK_WEATHER);

  React.useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadWeather = async () => {
      try {
        const coordinates = await getCoordinates();
        const locationPromise = getLocationLabel(
          coordinates.latitude,
          coordinates.longitude,
          controller.signal,
        );
        const forecastResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=auto`,
          {
            signal: controller.signal,
          },
        );

        if (!forecastResponse.ok) {
          throw new Error(`Weather request failed: ${forecastResponse.status}`);
        }

        const payload = (await forecastResponse.json()) as {
          current?: {
            temperature_2m?: number;
            weather_code?: number;
          };
        };

        const location = await locationPromise;
        const condition = weatherCodeToCondition(Number(payload.current?.weather_code ?? NaN));
        const temperature = formatTemperatureF(payload.current?.temperature_2m);

        if (temperature === '--°') {
          throw new Error('No valid weather temperature available');
        }

        if (!isMounted) {
          return;
        }

        setWeather({
          location,
          temperature,
          condition,
          icon: conditionToIcon(condition),
        });
      } catch {
        if (!isMounted) {
          return;
        }
        setWeather(FALLBACK_WEATHER);
      }
    };

    void loadWeather();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return weather;
};
