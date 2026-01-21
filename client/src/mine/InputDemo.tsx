import { useState } from "react"
import Input from "@/components/ui/input"

interface InputDemoProps {
  setWeatherData: React.Dispatch<React.SetStateAction<any[]>>
  setCostData: React.Dispatch<React.SetStateAction<any | null>>
  setFlightData: React.Dispatch<React.SetStateAction<{date: string, count: number}[]>>
}

export function InputDemo({ setWeatherData, setCostData, setFlightData }: InputDemoProps) {
  const [city, setCity] = useState("")
  const [loading, setLoading] = useState(false)

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && city.trim()) {
      setLoading(true)
      try {
        const res = await fetch(
          `http://localhost:3001/weather?city=${encodeURIComponent(city)}`
        )
        const json = await res.json()

        // Weather data
        const transformedData = json.data.map((item:any, index:any) => ({
          index,
          temperature: item.avgTemperature,
          precipitation: item.avgPrecipitation,
        }))
        setWeatherData(transformedData)

        // Flight data
        if (json.flightPrices) {
          setFlightData(json.flightPrices)
        }

        // Cost of living data
        if (json.selectedCosts) {
          setCostData(json.selectedCosts)
        }
      } catch (err) {
        console.error(err)
      }
      setLoading(false)
    }
  }

  return (
    <Input
      type="text"
      placeholder={loading ? "Loading..." : "Enter city"}
      className="w-75 mb-4"
      value={city}
      onChange={(e) => setCity(e.target.value)}
      onKeyDown={handleKeyDown}
    />
  )
}
