"use client";

import {useEffect, useState} from "react";

export default function DayBackground({children}: Readonly<{ children: React.ReactNode }>) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const calculateGradientPosition = () => {
    const hours = currentTime.getHours()
    const minutes = currentTime.getMinutes()
    const totalMinutes = hours * 60 + minutes
    const dayPercentage = (totalMinutes / (24 * 60)) * 100

    return `${dayPercentage}%`
  }

  const formatTime = () => {
    return currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
      <div
          className="min-h-screen p-4 flex flex-col justify-center items-center relative overflow-hidden"
          style={{
            background: `linear-gradient(to top, 
          #0c1445 0%, /* 12 AM - Midnight */
          #0f1a5c 4.16%, /* 1 AM */
          #132073 8.33%, /* 2 AM */
          #162689 12.5%, /* 3 AM */
          #1a2ca0 16.66%, /* 4 AM */
          #5b2e96 20.83%, /* 5 AM */
          #d45b88 25%, /* 6 AM - Sunrise */
          #f7a76c 29.16%, /* 7 AM */
          #ffde82 33.33%, /* 8 AM */
          #a5d9ef 37.5%, /* 9 AM */
          #82c4e6 41.66%, /* 10 AM */
          #6bbbf9 45.83%, /* 11 AM */
          #56b3fa 50%, /* 12 PM - Noon */
          #6bbbf9 54.16%, /* 1 PM */
          #82c4e6 58.33%, /* 2 PM */
          #a5d9ef 62.5%, /* 3 PM */
          #ffde82 66.66%, /* 4 PM */
          #f7a76c 70.83%, /* 5 PM */
          #d45b88 75%, /* 6 PM - Sunset */
          #5b2e96 79.16%, /* 7 PM */
          #1a2ca0 83.33%, /* 8 PM */
          #162689 87.5%, /* 9 PM */
          #132073 91.66%, /* 10 PM */
          #0f1a5c 95.83%, /* 11 PM */
          #0c1445 100% /* Back to Midnight */
        )`,
            backgroundSize: "100% 2400%",
            backgroundPosition: `0% ${calculateGradientPosition()}`,
          }}
      >
        {children}
      </div>
  )
};