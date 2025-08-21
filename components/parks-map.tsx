"use client"

// Core React and state management
import { useState, useMemo, useEffect } from "react"

// UI components from Shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Icons from Lucide React
import { Map, Maximize2, Layers, MapPin, CloudOff, Minimize2 } from "lucide-react"

// Motion for animations
import { motion, Variants, AnimatePresence } from "motion/react"

// Leaflet and React-Leaflet for the map
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"

// Import Leaflet directly to fix the marker icon issue with Webpack/Bundlers
import L from "leaflet"

// Fix for default Leaflet marker icons not showing correctly
const pinIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

// Define the data structure for a park
interface BristolPark {
  id: string
  name: string
  lat: number
  lng: number
  type: string
  area?: string
  description?: string
  facilities?: string[]
}

// Define the component
export function ParksMap() {
  const [selectedPark, setSelectedPark] = useState<BristolPark | null>(null)
  const [parks, setParks] = useState<BristolPark[]>([])
  const [isOffline, setIsOffline] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  // Use a mock dataset as the source of truth, as the WFS service is unreliable.
  // This ensures the map always works.
  const cachedParks = useMemo(() => [
    { id: "1", name: "Castle Street Park", lat: 51.4545, lng: -2.5879, type: "Urban Park", area: "2.3 hectares" },
    { id: "2", name: "Brandon Hill Nature Park", lat: 51.452, lng: -2.605, type: "Nature Reserve", area: "8.5 hectares" },
    { id: "3", name: "Queen Square", lat: 51.45, lng: -2.6, type: "Historic Square", area: "1.2 hectares" },
    { id: "4", name: "The Downs", lat: 51.465, lng: -2.62, type: "Common Land", area: "162 hectares" },
    { id: "5", name: "Victoria Park", lat: 51.448, lng: -2.618, type: "Community Park", area: "4.7 hectares" },
    { id: "6", name: "Eastville Park", lat: 51.478, lng: -2.553, type: "Community Park", area: "28 hectares" },
    { id: "7", name: "Blaise Castle Estate", lat: 51.501, lng: -2.641, type: "Historic Park", area: "162 hectares" },
  ], [])

  // Simulate data fetching on component mount
  useEffect(() => {
    // We'll simulate the fetch process and then fall back to cached data
    // to provide a consistent user experience.
    const simulateFetch = () => {
      // Simulate a successful fetch with cached data
      setParks(cachedParks)
      // Simulate a failure to fetch real-time data
      setIsOffline(true)
    }

    // Call the simulated fetch
    simulateFetch()
  }, [cachedParks])

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  // Variants for animation
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  const mapVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <Card
        className={`h-fit shadow-none border-border/60 hover:border-border bg-card transition-all duration-300 ${isExpanded ? "fixed inset-0 z-[100] rounded-none md:rounded-xl md:p-8" : ""}`}
      >
        <CardHeader className="pb-4">
          <motion.div variants={itemVariants}>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3">
                <motion.div
                  className="p-1.5 md:p-2 bg-primary/10 rounded-lg"
                  whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Map className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                </motion.div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-foreground">
                    Interactive Map
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                    {isOffline ? "Showing cached data" : "Real-time Bristol parks data"}
                  </p>
                </div>
              </div>
              <div className="flex gap-1 md:gap-2">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 md:h-8 md:w-8 p-0 bg-transparent border-border hover:bg-accent"
                  >
                    <Layers className="h-3 w-3 md:h-4 md:w-4" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 md:h-8 md:w-8 p-0 bg-transparent border-border hover:bg-accent"
                    onClick={toggleExpanded}
                  >
                    {isExpanded ? (
                      <Minimize2 className="h-3 w-3 md:h-4 md:w-4" />
                    ) : (
                      <Maximize2 className="h-3 w-3 md:h-4 md:w-4" />
                    )}
                  </Button>
                </motion.div>
              </div>
            </CardTitle>
          </motion.div>
        </CardHeader>

        <CardContent className="space-y-4">
          <motion.div
            variants={mapVariants}
            className="relative rounded-xl border border-border overflow-hidden"
            style={{ height: isExpanded ? "calc(100vh - 8rem)" : "24rem" }}
          >

            <MapContainer
              center={[51.4545, -2.5879]}
              zoom={12}
              scrollWheelZoom={true}
              className="z-0"
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {parks.map((park) => (
                <Marker
                  key={park.id}
                  position={[park.lat, park.lng]}
                  icon={pinIcon}
                  eventHandlers={{
                    click: () => setSelectedPark(
                      selectedPark?.id === park.id ? null : park
                    )
                  }}
                >
                  <Popup>
                    <strong>{park.name}</strong><br />
                    {park.type} {park.area ? `• ${park.area}` : ""}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            <AnimatePresence>
              {selectedPark && (
                <motion.div
                  className="absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4 bg-background/95 backdrop-blur-sm rounded-lg border border-border p-3 md:p-4 shadow-lg z-30"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 min-w-0 flex-1">
                      <h4 className="font-semibold text-foreground text-sm md:text-base truncate">
                        {selectedPark.name}
                      </h4>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {selectedPark.type}
                        {selectedPark.area && ` • ${selectedPark.area}`}
                      </p>
                      {selectedPark.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {selectedPark.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">
                          {selectedPark.lat.toFixed(4)}, {selectedPark.lng.toFixed(4)}
                        </span>
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs bg-transparent border-border hover:bg-accent shrink-0"
                      >
                        <span className="hidden sm:inline">Get Directions</span>
                        <span className="sm:hidden">Directions</span>
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg p-3"
          >
            <div className="space-y-1">
              <p className="font-medium">Live Data Sources:</p>
              <p>© OpenStreetMap contributors • Mock Data</p>
            </div>
            <div className="sm:text-right space-y-1">
              <p className="font-medium">Services:</p>
              <p>Map tiles via openstreetmap.org</p>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
