"use client";

import { Cloud, Droplets, Wind } from "lucide-react";
import { useEffect, useState, useMemo, useRef } from "react";
import throttle from "lodash/throttle";
import WeatherEffects from "@/components/weatherbackground";

export default function Page() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState<any>(null);
  const [hasWeather, setHasWeather] = useState(false);
  const [hasLocation, setHasLocation] = useState(0);
  const [isFarenheit, setIsFahrenheit] = useState(false);
  const [latlon, setLatlon] = useState({ lat: 0, lon: 0 });
  const [showCityInput, setShowCityInput] = useState("");

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const formatTime = useMemo(() => {
    return currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }, [currentTime]);

  const handleSearch = async () => {
    if (!showCityInput) return;

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    searchTimeout.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/weather?city=${showCityInput}`);
        if (!response.ok) throw new Error("Failed to fetch weather!");
        const data = await response.json();
        if (data && data.main) {
          setWeather(data);
          setHasWeather(true);
          setIsFahrenheit(true);
        } else {
          setWeather(null);
          setHasWeather(false);
          console.error("Invalid weather data:", data);
        }
      } catch (e) {
        setHasLocation(2);
        console.error("Error fetching weather data:", e);
      }
    }, 500); // Debounce delay
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const updateLatLon = throttle((position: GeolocationPosition) => {
      setLatlon((prev) => {
        if (
            prev.lat === position.coords.latitude &&
            prev.lon === position.coords.longitude
        ) {
          return prev;
        }
        return { lat: position.coords.latitude, lon: position.coords.longitude };
      });
      setHasLocation(1);
    }, 1000);

    navigator.geolocation.getCurrentPosition(
        updateLatLon,
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setHasLocation(2);
          }
        }
    );
  }, []);

  useEffect(() => {
    if (hasLocation === 1 && latlon.lat !== 0 && latlon.lon !== 0) {
      fetch(`/api/weather?lat=${latlon.lat}&lon=${latlon.lon}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to fetch weather data");
            }
            return response.json();
          })
          .then((data) => {
            if (data && data.main) {
              setWeather(data);
              setHasWeather(true);
            } else {
              setWeather(null);
              setHasWeather(false);
              console.error("Invalid weather data:", data);
            }
          })
          .catch((error) => {
            console.error("Error fetching weather data:", error);
            setHasWeather(false);
          });
    }
  }, [latlon, hasLocation]);

  return (
      <WeatherEffects
          condition={weather?.weather[0]?.description}
          temperature={
            weather?.main?.temp ? Math.round(isFarenheit ? ((weather.main.temp-32)*5/9/2) : (weather.main.temp-273.15)) : 0
          }
          windSpeed={weather?.wind?.speed ?? 0}>
        {hasWeather ? (
            <div>
              <div className="w-full max-w-md mx-auto py-4 z-10 bg-white/80 dark:bg-gray-800/80 px-3 py-1 rounded-xl text-sm font-medium backdrop-blur-sm text-center">
                Current Time: {formatTime}
              </div>

              <div className="w-full max-w-md mx-auto mt-8 mb-6 z-10">
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 text-center">
                  <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-100">
                    {weather?.main?.temp ? `${Math.round(isFarenheit ? ((weather.main.temp-32)*5/9/2) : (weather.main.temp-273.15))}°C` : "N/A"}
                  </h1>
                  <h2 className="text-2xl font-medium text-gray-700 dark:text-gray-200 mt-2">
                    {weather.coord.lat} • {weather.coord.lon}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {weather?.weather?.[0]?.description
                        ? `${weather.weather[0].description} • Feels like ${Math.round(
                            isFarenheit ? ((weather.main.feels_like-32)*5/9/2) : (weather.main.feels_like-273.15)
                        )}°C`
                        : "N/A"}
                  </p>
                  <div className="flex justify-center gap-4 mt-4">
                    <div className="flex items-center">
                      <Droplets className="h-5 w-5 text-blue-500 mr-1" />
                      <span className="text-sm">{weather?.main?.humidity ?? "N/A"}%</span>
                    </div>
                    <div className="flex items-center">
                      <Wind className="h-5 w-5 text-blue-500 mr-1" />
                      <span className="text-sm">{weather?.wind?.speed ?? "N/A"} km/h</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full max-w-md grid grid-cols-1 md:grid-cols-1 gap-4 z-10">
                <div className="bg-gray-100/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 shadow-md">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                    Weather Details
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Humidity</span>
                      <span>{weather?.main?.humidity ?? "N/A"} %</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pressure</span>
                      <span>{weather?.main?.grnd_level ?? "N/A"} hPa</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Visibility</span>
                      <span>{weather?.visibility ? `${(weather.visibility / 1000).toFixed(1)} km` : "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        ) : hasLocation === 0 ? (
            <h1 className="md:text-7xl font-bold">Loading Weather...</h1>
        ) : (
            <>
              <h1 className="md:text-7xl font-bold">Please enable location services</h1>
              <input
                  type="text"
                  placeholder="City"
                  onChange={(e) => setShowCityInput(e.target.value)}
                  className="mt-4 p-2 border rounded"
              />
              <button
                  type="submit"
                  onClick={handleSearch}
                  className="mt-2 p-2 bg-blue-500 text-white rounded"
              >
                Search
              </button>
            </>
        )}
      </WeatherEffects>
  );
}