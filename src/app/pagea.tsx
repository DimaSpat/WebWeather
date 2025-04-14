"use client";

import { Cloud, Droplets, Wind } from "lucide-react";
import { useEffect, useState } from "react";

export default function Page() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState();
  const [hasWeather, setHasWeather] = useState(false);
  const [hasLocation, setHasLocation] = useState(0);
  const [latlon, setLatlon] = useState({ lat: 0, lon: 0 });
  const [showCityInput, setShowCityInput] = useState("");

  const formatTime = () => {
    return currentTime.toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})
  };

//   const handleCitySearch = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!showCityInput) return;
//
//     try {
//       const reponse = await fetch(`/api/weather?city=${showCityInput}`);
//       if (!reponse.ok) throw new Error("Failed to fetch weather!");
//       const data = await reponse.json();
//       setWeather(data);
//       setHasWeather(true);
//       setHasLocation(1);
//     } catch (e) {
//       setHasLocation(2);
//       console.error("Error fetching weather data:", e);
//     }
//   }
// };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLatlon({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      })
      setHasLocation(1);
    },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setHasLocation(2);
          }
        });

    if (hasLocation === 1) {
      fetch(`/api/weather?lat=${latlon.lat}&lon=${latlon.lon}`)
          .then(response => response.json())
          .then(data => setWeather(data))
          .then(() => setHasWeather(true))
          .catch(error => console.error(error));
    }
  }, []);

  useEffect(() => {
    if (hasWeather) {
      console.log(hasLocation);
    }
  }, [hasLocation]);



  return (
      <>
        {hasWeather ? (
            <div>
              <div
                  className="w-full max-w-md mx-auto py-4 z-10 bg-white/80 dark:bg-gray-800/80 px-3 py-1 rounded-xl text-sm font-medium backdrop-blur-sm text-center">
                Current Time: {formatTime()}
              </div>

              <div className="w-full max-w-md mx-auto mt-8 mb-6 z-10">
                {/* Main weather display */}
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 text-center">
                  <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-100">{Math.round(weather.main.temp - 273.15)}°C</h1>
                  <h2 className="text-2xl font-medium text-gray-700 dark:text-gray-200 mt-2">{latlon.lat} • {latlon.lon}</h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">{weather.weather[0].description} • Feels
                    like {Math.round(weather.main.feels_like - 273.15)}°C</p>
                  <div className="flex justify-center gap-4 mt-4">
                    <div className="flex items-center">
                      <Droplets className="h-5 w-5 text-blue-500 mr-1"/>
                      <span className="text-sm">{weather.main.humidity}%</span>
                    </div>
                    <div className="flex items-center">
                      <Wind className="h-5 w-5 text-blue-500 mr-1"/>
                      <span className="text-sm">{weather.wind.speed} km/h</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Two smaller sections with semi-transparent background */}
              <div className="w-full max-w-md grid grid-cols-1 md:grid-cols-1 gap-4 z-10">
                <div className="bg-gray-100/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 shadow-md">
                  <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Weather Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Humidity</span>
                      <span>{weather.main.humidity} %</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pressure</span>
                      <span>{weather.main.grnd_level} hPa</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Visibility</span>
                      <span>{weather.visibility / 1000} km</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        ) : (
            hasLocation === 0 ? (
                    <h1 className="md:text-7xl  font-bold">Loading Weather...</h1>
                ) :
                (
                    <><h1 className="md:text-7xl font-bold">Please enable location services</h1>
                      <input type="text" placeholder={"city"} onChange={(e) => setShowCityInput(e.target.value)}/>
                      <button type="submit" onClick={}>Search</button>
                      </>
                )
        )}
      </>
  );
}