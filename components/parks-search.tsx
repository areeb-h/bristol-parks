"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Search, Filter, Download, MapPin, Database, ExternalLink, Star, Eye, Navigation, Clock, Users, TreePine, X, MoreVertical, Globe, Map, Loader2 } from "lucide-react"
import { motion, Variants, AnimatePresence } from "framer-motion"

interface BristolPark {
  objectId: number;
  assetId: string;
  siteName: string;
  location: string;
  type: string;
  primaryMeasure: number;
  unit: string;
  siteCode: string;
  featureGroup: string;
  coordinates: { lat: number; lng: number };
  area: number;
  majorSite: string;
  validated: string;
  // Enhanced fields for better UX
  description?: string;
  facilities?: string[];
  rating?: number;
  accessibility?: string;
  openingHours?: string;
  lastUpdated?: string;
}

// A mapping for colors based on the FEAT_ID types
// Updated to use the actual FEAT_ID values from the CSV
const featIdToColorMap: { [key: string]: string } = {
  'Open Space': 'bg-green-100 text-green-700 border-green-200',
  'Parks and Green Space Site': 'bg-primary/10 text-primary border-primary/20',
  'Local Park': 'bg-purple-100 text-purple-700 border-purple-200',
  'Recreation Ground': 'bg-blue-100 text-blue-700 border-blue-200',
  'Formal Garden': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Playing Field': 'bg-rose-100 text-rose-700 border-rose-200',
  'Allotments': 'bg-lime-100 text-lime-700 border-lime-200',
  'Woodland': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Community Garden': 'bg-cyan-100 text-cyan-700 border-cyan-200',
};

// A list of the park types that will be used for filters. This is now dynamic.
interface FilterOption {
  value: string;
  label: string;
  count: number;
}


export function ParksSearch() {
  const [parks, setParks] = useState<BristolPark[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [filterType, setFilterType] = useState<string>("all")
  const [selectedPark, setSelectedPark] = useState<BristolPark | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [resultsCount, setResultsCount] = useState<number>(0)
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState<boolean>(false)
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([])
  // State to manage auto-scrolling
  const [visibleParksCount, setVisibleParksCount] = useState(10);
  const scrollContainerRef = useRef<HTMLDivElement>(null);


  // Load and process the CSV data
  useEffect(() => {
    const loadParksData = async () => {
      try {
        setLoading(true)

        // Step 1: Use the Fetch API to get the CSV data
        const response = await fetch('/Parks_and_green_spaces.csv')

        // Handle potential network or file errors
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`)
        }

        const csvData = await response.text()

        // Step 2: Parse CSV using Papaparse
        const Papa = await import('papaparse')
        const parsed = Papa.parse(csvData, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          transformHeader: (header: string) => header.trim()
        })

        // Transform the data to our interface
        const transformedParks: BristolPark[] = parsed.data
          .filter((row: any) => row.SITE_NAME && row.SITE_NAME.trim() !== '')
          .map((row: any, index: number) => {
            // Use FEATURE_ID for the park type directly
            const parkType = row.FEATURE_ID || 'General Green Space';

            return {
              objectId: row.OBJECTID || index,
              assetId: row.ASSET_ID || '',
              siteName: row.SITE_NAME || 'Unknown Park',
              location: row.LOCATION || 'Bristol',
              type: parkType,
              primaryMeasure: row.PRIM_MEAS || 0,
              unit: row.UNIT || 'hectares',
              siteCode: row.SITE_CODE || '',
              featureGroup: row.FEAT_GP || 'Park',
              coordinates: {
                lat: row.CENTROID_Y || 51.4545,
                lng: row.CENTROID_X || -2.5879
              },
              area: row.FEATURE_AREA || row['gislive.PARKS.P_AND_GS_SITES.AREA'] || 0,
              majorSite: row.MAJOR_SITE || 'No',
              validated: row.VALIDATED || 'Yes',
              // Use the FEATURE_ID for helper functions
              description: generateDescription(row.SITE_NAME, parkType, row.LOCATION),
              facilities: generateFacilities(parkType),
              rating: generateRating(row.MAJOR_SITE, row.FEATURE_AREA || 0),
              accessibility: generateAccessibility(parkType),
              openingHours: generateOpeningHours(parkType),
              lastUpdated: 'August 2025',
            }
          })
          .slice(0, 50) // Limit to first 50 parks for performance

        setParks(transformedParks)
        setResultsCount(transformedParks.length)

        // Dynamically create filter options from the dataset
        const typeCounts = transformedParks.reduce((acc, park) => {
          const parkType = park.type;
          if (acc[parkType]) {
            acc[parkType].count += 1;
          } else {
            acc[parkType] = {
              value: parkType,
              label: parkType,
              count: 1
            };
          }
          return acc;
        }, {} as Record<string, FilterOption>);

        const newFilterOptions = [
          { value: "all", label: "All Parks", count: transformedParks.length },
          { value: "major", label: "Major Sites", count: transformedParks.filter(p => p.majorSite === "Yes").length },
          ...Object.values(typeCounts).sort((a, b) => b.count - a.count)
        ];
        setFilterOptions(newFilterOptions);

      } catch (error) {
        console.error('Error loading parks data:', error)
        // Fallback to sample data if CSV loading fails
        setParks(sampleParks)
        setResultsCount(sampleParks.length)
      } finally {
        setLoading(false)
      }
    }

    loadParksData()
  }, [])

  // Helper functions to generate enhanced data
  const generateDescription = (siteName: string, parkType: string, location: string): string => {
    const descriptions: { [key: string]: string } = {
      'Open Space': `A public open space in ${location}, providing a versatile green area for community use.`,
      'Parks and Green Space Site': `A large and well-maintained green space in ${location}, designed for a variety of recreational activities.`,
      'Local Park': `A neighborhood park in ${location}, ideal for relaxation and local gatherings.`,
      'Recreation Ground': `A community recreation area in ${location}, offering open green space perfect for sports and leisure activities.`,
      'Formal Garden': `A beautifully landscaped formal garden in ${location}, featuring maintained grounds and serene pathways.`,
      'Playing Field': `A dedicated playing field in ${location}, perfect for team sports and outdoor activities.`,
      'Allotments': `A series of private gardening plots in ${location}, providing a space for local residents to grow their own produce.`,
      'Woodland': `A natural woodland area in ${location}, featuring established trees and walking paths for nature appreciation.`,
      'Community Garden': `A shared community garden space in ${location}, where residents can work together to cultivate plants and food.`,
    }

    return descriptions[parkType] || `A ${parkType.toLowerCase()} located in ${location}, providing valuable green space for the local community to enjoy.`
  }

  const generateFacilities = (parkType: string): string[] => {
    const facilityMap: { [key: string]: string[] } = {
      'Open Space': ['Open Grass', 'Public Access'],
      'Parks and Green Space Site': ['Walking Paths', 'Open Space', 'Recreation Areas'],
      'Local Park': ['Playground', 'Seating', 'Walking Paths'],
      'Recreation Ground': ['Sports Areas', 'Open Grass', 'Walking Paths'],
      'Formal Garden': ['Landscaped Gardens', 'Pathways', 'Seating'],
      'Playing Field': ['Sports Pitch', 'Goals', 'Open Grass'],
      'Allotments': ['Gardening Plots', 'Communal Sheds', 'Water Access'],
      'Woodland': ['Walking Trails', 'Nature Areas', 'Wildlife Habitat'],
      'Community Garden': ['Shared Plots', 'Communal Benches'],
    }

    return facilityMap[parkType] || ['Green Space', 'Public Access']
  }

  const generateRating = (majorSite: string, area: number): number => {
    let rating = 3.5 // Base rating

    if (majorSite === 'Yes') rating += 0.8
    if (area > 10000) rating += 0.4 // Large parks get higher ratings
    if (area > 50000) rating += 0.3

    return Math.min(Math.round(rating * 10) / 10, 5.0)
  }

  const generateAccessibility = (parkType: string): string => {
    const accessibilityMap: { [key: string]: string } = {
      'Open Space': 'Generally accessible with paths',
      'Parks and Green Space Site': 'Good accessibility with a variety of paths',
      'Local Park': 'Accessible with paved walkways',
      'Recreation Ground': 'Generally accessible with paths',
      'Formal Garden': 'Fully accessible with paved paths',
      'Playing Field': 'Generally accessible with even terrain',
      'Allotments': 'Limited accessibility, may have uneven terrain',
      'Woodland': 'Variable - natural terrain',
      'Community Garden': 'Accessible with some uneven terrain',
    }

    return accessibilityMap[parkType] || 'Accessibility information available on site'
  }

  const generateOpeningHours = (parkType: string): string => {
    if (parkType.includes('Woodland') || parkType.includes('Open Space') || parkType.includes('Informal')) {
      return 'Dawn to dusk'
    }
    return '24 hours'
  }

  // Sample fallback data
  const sampleParks: BristolPark[] = [
    {
      objectId: 1,
      assetId: 'BCC001',
      siteName: 'Brandon Hill Nature Park',
      location: 'City Centre',
      type: 'Local Park',
      primaryMeasure: 8.5,
      unit: 'hectares',
      siteCode: 'BH001',
      featureGroup: 'Major Park',
      coordinates: { lat: 51.452, lng: -2.605 },
      area: 85000,
      majorSite: 'Yes',
      validated: 'Yes',
      description: 'Bristol\'s oldest park featuring the iconic Cabot Tower with panoramic city views.',
      facilities: ['Walking Trails', 'Cabot Tower', 'Wildlife Areas'],
      rating: 4.8,
      accessibility: 'Limited accessibility due to terrain',
      openingHours: '24 hours',
      lastUpdated: 'August 2025'
    }
  ]

  const handleDownload = () => {
    const csvContent = "data:text/csv;charset=utf-8,Park Name,Type,Area,Location,Rating\n" +
      filteredParks.map(p => `${p.siteName},${p.type},${p.primaryMeasure} ${p.unit},${p.location},${p.rating}`).join("\n")
    const link = document.createElement("a")
    link.setAttribute("href", encodeURI(csvContent))
    link.setAttribute("download", "bristol_parks_real_data.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleViewPark = (park: BristolPark) => {
    setSelectedPark(park)
    setIsModalOpen(true)
  }

  const handleClearFilters = () => {
    setSearchTerm("")
    setFilterType("all")
    setIsFilterPanelOpen(false)
    setVisibleParksCount(10); // Reset pagination on clear
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
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

  const filteredParks = useMemo(() => {
    let filtered = parks

    if (searchTerm) {
      filtered = filtered.filter(
        (park) =>
          park.siteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          park.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          park.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          park.facilities?.some((facility) => facility.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Filter by the type from the FEATURE_ID column or major site
    if (filterType !== "all") {
      if (filterType === "major") {
        filtered = filtered.filter((park) => park.majorSite === "Yes");
      } else {
        filtered = filtered.filter((park) => park.type === filterType);
      }
    }

    return filtered
  }, [parks, searchTerm, filterType])

  // Get the parks to display based on the visibleParksCount
  const displayedParks = useMemo(() => {
    return filteredParks.slice(0, visibleParksCount);
  }, [filteredParks, visibleParksCount]);

  // Auto-scroll pagination logic
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      // Check if the user has scrolled to the bottom of the container
      if (scrollContainer.scrollHeight - scrollContainer.scrollTop <= scrollContainer.clientHeight + 1) {
        // If there are more parks to load, increase the visible count
        setVisibleParksCount(prevCount => Math.min(prevCount + 10, filteredParks.length));
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [filteredParks.length, visibleParksCount]);

  useEffect(() => {
    setResultsCount(filteredParks.length)
    setVisibleParksCount(10); // Reset visible count when filters change
  }, [filteredParks.length, searchTerm, filterType])

  const getTypeColor = (type: string) => {
    return featIdToColorMap[type] || "bg-secondary text-secondary-foreground"
  }


  const isFiltered = searchTerm || filterType !== "all"

  if (loading) {
    return (
      <Card className="bg-card shadow-none border-border/60">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Loading Bristol Parks data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <Card className="bg-card shadow-none border-border/60 hover:border-border transition-all duration-300">
          <CardHeader className="pb-4">
            <motion.div variants={itemVariants}>
              <CardTitle className="flex items-center gap-3 text-card-foreground">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Search className="h-4 w-4 text-primary" />
                </div>
                <span>Bristol Parks & Green Spaces</span>
                <Badge variant="secondary" className="ml-auto">
                  Real Data • {parks.length} Parks
                </Badge>
              </CardTitle>
            </motion.div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <motion.div variants={itemVariants} className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Search parks by name, location, type, or facilities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 transition-all duration-200"
                  />
                </div>
                <div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                    className={`bg-input border-border hover:bg-accent hover:border-accent transition-all duration-200 ${isFilterPanelOpen ? 'bg-accent/40 text-primary' : ''}`}
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
                <AnimatePresence>
                  {isFiltered && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleClearFilters}
                        className="text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-all duration-200"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <AnimatePresence>
                {isFilterPanelOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="grid sm:grid-cols-3 gap-2 mt-2">
                      {filterOptions.map((option) => (
                        <div key={option.value}>
                          <Button
                            variant={filterType === option.value ? "default" : "secondary"}
                            onClick={() => setFilterType(option.value)}
                            className={`w-full justify-between hover:text-primary-foreground transition-colors duration-200 ${filterType === option.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"}`}
                          >
                            <span className="text-xs">{option.label}</span>
                            <span className="text-xs font-normal opacity-70">
                              ({option.count})
                            </span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-4">
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-between text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span>
                    Showing <span className="font-medium text-foreground">{displayedParks.length}</span> of {filteredParks.length} parks
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDownload}
                    className="text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-all duration-200"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </motion.div>

              {/* Scrollable container for auto-pagination */}
              <div
                ref={scrollContainerRef}
                className="rounded-md border border-border overflow-y-auto max-h-[60vh] md:max-h-[70vh] relative"
              >
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-muted/50 sticky top-0 bg-background/90 backdrop-blur-sm">
                      <TableHead className="min-w-[180px] text-muted-foreground font-medium">
                        Park Name
                      </TableHead>
                      <TableHead className="min-w-[120px] text-muted-foreground font-medium">
                        Type
                      </TableHead>
                      {/* <TableHead className="min-w-[80px] hidden sm:table-cell text-muted-foreground font-medium">
                        Area
                      </TableHead> */}
                      <TableHead className="min-w-[80px] text-muted-foreground font-medium">
                        Rating
                      </TableHead>
                      <TableHead className="min-w-[80px] text-muted-foreground font-medium">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedParks.map((park, index) => (
                      <motion.tr
                        key={park.objectId}
                        className="border-border hover:bg-muted/50 transition-colors duration-200"
                      >
                        <TableCell className="min-w-[180px]">
                          <div>
                            <div className="font-medium text-sm md:text-base text-card-foreground">
                              {park.siteName}
                            </div>
                            <div className="text-xs md:text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {park.location}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="min-w-[120px]">
                          <div>
                            <Badge
                              variant="outline"
                              className={`text-xs border ${getTypeColor(park.type)}`}
                            >
                              {park.type}
                            </Badge>
                            {park.majorSite === 'Yes' && (
                              <Badge variant="secondary" className="ml-1 text-xs">
                                Major Site
                              </Badge>
                            )}
                          </div>
                        </TableCell>

                        {/* <TableCell className="min-w-[80px] hidden sm:table-cell text-sm text-card-foreground">
                          {park.primaryMeasure > 0 ? `${park.primaryMeasure} ${park.unit}` : 'N/A'}
                        </TableCell> */}

                        <TableCell className="min-w-[80px]">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 md:h-4 md:w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-card-foreground font-medium">
                              {park.rating}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="min-w-[80px]">
                          <div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 hover:bg-accent text-muted-foreground hover:text-card-foreground transition-colors duration-200"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem
                                  onClick={() => handleViewPark(park)}
                                  className="cursor-pointer"
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                  <Map className="mr-2 h-4 w-4" />
                                  View on Map
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                  <Navigation className="mr-2 h-4 w-4" />
                                  Get Directions
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer">
                                  <Globe className="mr-2 h-4 w-4" />
                                  Council Website
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                  <Download className="mr-2 h-4 w-4" />
                                  Download Info
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                    {/* Loading indicator for auto-scroll */}
                    {displayedParks.length < filteredParks.length && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          <Loader2 className="h-5 w-5 animate-spin text-primary mx-auto" />
                          <p className="text-xs text-muted-foreground mt-2">Loading more parks...</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {filteredParks.length === 0 && (
                <motion.div
                  className="text-center py-8 text-muted-foreground"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="p-4 rounded-lg bg-muted/30 inline-block mb-3">
                    <Database className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-sm">No parks found matching your criteria.</p>
                  <p className="text-xs mt-1">Try adjusting your search or filter settings.</p>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced Modal for Real Data */}
      <AnimatePresence>
        {isModalOpen && selectedPark && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-border">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <DialogHeader className="pb-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <DialogTitle className="text-2xl font-bold text-foreground">
                        {selectedPark.siteName}
                      </DialogTitle>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {selectedPark.location}
                        </div>
                        <Badge className={`${getTypeColor(selectedPark.type)}`}>
                          {selectedPark.type}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {selectedPark.rating}
                        </div>
                        {selectedPark.majorSite === 'Yes' && (
                          <Badge variant="secondary">Major Site</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <p className="text-foreground leading-relaxed">
                      {selectedPark.description}
                    </p>
                  </div>

                  <Separator />

                  {/* Enhanced Info Grid with Real Data */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-muted/30 rounded-lg p-4 text-center">
                      <TreePine className="h-6 w-6 text-primary mx-auto mb-2" />
                      <div className="text-sm font-medium text-foreground">
                        {selectedPark.primaryMeasure > 0 ? `${selectedPark.primaryMeasure} ${selectedPark.unit}` : 'Area N/A'}
                      </div>
                      <div className="text-xs text-muted-foreground">Total Area</div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4 text-center">
                      <Clock className="h-6 w-6 text-accent mx-auto mb-2" />
                      <div className="text-sm font-medium text-foreground">{selectedPark.openingHours}</div>
                      <div className="text-xs text-muted-foreground">Opening Hours</div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4 text-center">
                      <Database className="h-6 w-6 text-primary mx-auto mb-2" />
                      <div className="text-sm font-medium text-foreground">{selectedPark.assetId}</div>
                      <div className="text-xs text-muted-foreground">Asset ID</div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-4 text-center">
                      <Navigation className="h-6 w-6 text-accent mx-auto mb-2" />
                      <div className="text-sm font-medium text-foreground">{selectedPark.accessibility}</div>
                      <div className="text-xs text-muted-foreground">Accessibility</div>
                    </div>
                  </div>

                  <Separator />

                  {/* Real Data Information */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-3">Park Information</h3>
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">Facilities</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedPark.facilities?.map((facility, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {facility}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">Site Details</h4>
                          <div className="text-sm space-y-1">
                            <p><strong>Site Code:</strong> {selectedPark.siteCode}</p>
                            <p><strong>Feature Group:</strong> {selectedPark.featureGroup}</p>
                            <p><strong>Validated:</strong> {selectedPark.validated}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-3">Location Details</h3>
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">Coordinates</h4>
                          <p className="text-sm text-foreground font-mono">
                            {selectedPark.coordinates.lat.toFixed(6)}, {selectedPark.coordinates.lng.toFixed(6)}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">Area Measurements</h4>
                          <div className="text-sm space-y-1">
                            <p><strong>Primary:</strong> {selectedPark.primaryMeasure} {selectedPark.unit}</p>
                            <p><strong>Feature Area:</strong> {selectedPark.area.toLocaleString()} m²</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Data Source Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Data Source</h3>
                    <div className="bg-muted/20 rounded-lg p-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">Dataset</h4>
                          <p className="text-sm text-foreground">Bristol Parks & Green Space Strategy Sites</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-1">Last Updated</h4>
                          <p className="text-sm text-foreground">{selectedPark.lastUpdated}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pt-4">
                    <Button className="flex items-center gap-2" size="sm">
                      <Navigation className="h-4 w-4" />
                      Get Directions
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2" size="sm">
                      <ExternalLink className="h-4 w-4" />
                      View on Map
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2" size="sm">
                      <Download className="h-4 w-4" />
                      Download Info
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2" size="sm">
                      <Globe className="h-4 w-4" />
                      Council Website
                    </Button>
                  </div>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  )
}
