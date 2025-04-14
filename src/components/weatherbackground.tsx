import type { ReactNode } from "react";

export type WeatherCondition = "sunny" | "cloudy" | "rainy" | "snowy" | "windy" | "clear"

interface WeatherEffectsProps {
  condition: WeatherCondition
  temperature: number
  windSpeed: number
  children?: ReactNode
}

export default function WeatherEffects({ condition, temperature, windSpeed, children }: WeatherEffectsProps) {
  return (
      <>
        {/* Weather Effects Layer */}
        <div className="fixed inset-0 pointer-events-none z-10">
          {condition?.includes("cloud") && <CloudsEffect />}
          {condition?.includes("rain") && <RainEffect />}
          {condition?.includes("snow") && <SnowEffect />}
          {condition?.includes("sun") && temperature > 20 && <SunEffect />}
          {condition?.includes("wind") && windSpeed > 40 && <WindEffect />}
        </div>

        {/* Content Layer */}
        {children}
      </>
  )
}

// Weather Effect Components
function CloudsEffect() {
  return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
            <div
                key={i}
                className="absolute opacity-70 bg-white rounded-full"
                style={{
                  width: `${Math.random() * 150 + 100}px`,
                  height: `${Math.random() * 80 + 60}px`,
                  top: `${Math.random() * 70}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `float ${Math.random() * 60 + 60}s linear infinite`,
                  animationDelay: `${Math.random() * 60}s`,
                }}
            />
        ))}
        <style jsx>{`
        @keyframes float {
          0% {
            transform: translateX(100vw);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
      </div>
  )
}

function RainEffect() {
  return (
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(100)].map((_, i) => (
            <div
                key={i}
                className="absolute bg-blue-400 opacity-70"
                style={{
                  width: "2px",
                  height: `${Math.random() * 20 + 10}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `rain ${Math.random() * 1 + 0.5}s linear infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
            />
        ))}
        <style jsx>{`
        @keyframes rain {
          0% {
            transform: translateY(-100px);
          }
          100% {
            transform: translateY(100vh);
          }
        }
      `}</style>
      </div>
  )
}

function SnowEffect() {
  return (
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(100)].map((_, i) => (
            <div
                key={i}
                className="absolute bg-white rounded-full"
                style={{
                  width: `${Math.random() * 6 + 2}px`,
                  height: `${Math.random() * 6 + 2}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.6 + 0.4,
                  animation: `snow ${Math.random() * 10 + 10}s linear infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
            />
        ))}
        <style jsx>{`
        @keyframes snow {
          0% {
            transform: translateY(-10px) translateX(0);
          }
          25% {
            transform: translateY(25vh) translateX(10px);
          }
          50% {
            transform: translateY(50vh) translateX(-10px);
          }
          75% {
            transform: translateY(75vh) translateX(10px);
          }
          100% {
            transform: translateY(100vh) translateX(0);
          }
        }
      `}</style>
      </div>
  )
}

function SunEffect() {
  return (
      <div className="fixed pointer-events-none">
        <div
            className="absolute rounded-full"
            style={{
              width: "150px",
              height: "150px",
              top: "15%",
              right: "15%",
              background:
                  "radial-gradient(circle, rgba(255,236,95,1) 0%, rgba(255,167,37,0.7) 70%, rgba(255,167,37,0) 100%)",
              boxShadow: "0 0 60px rgba(255, 236, 95, 0.7)",
              animation: "pulse 3s ease-in-out infinite alternate",
            }}
        />
        {[...Array(12)].map((_, i) => (
            <div
                key={i}
                className="absolute bg-yellow-300 opacity-60"
                style={{
                  width: "3px",
                  height: "80px",
                  top: "calc(15% + 75px)",
                  right: "calc(15% + 75px)",
                  transformOrigin: "top",
                  transform: `rotate(${i * 30}deg) translateY(-40px)`,
                }}
            />
        ))}
        <style jsx>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 60px rgba(255, 236, 95, 0.7);
          }
          100% {
            box-shadow: 0 0 100px rgba(255, 236, 95, 0.9);
          }
        }
      `}</style>
      </div>
  )
}

function WindEffect() {
  return (
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
            <div
                key={i}
                className="absolute bg-white opacity-40"
                style={{
                  height: `${Math.random() * 1 + 1}px`,
                  width: `${Math.random() * 100 + 50}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `wind ${Math.random() * 3 + 1}s linear infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
            />
        ))}
        <style jsx>{`
        @keyframes wind {
          0% {
            transform: translateX(-100px);
          }
          100% {
            transform: translateX(100vw);
          }
        }
      `}</style>
      </div>
  )
}
