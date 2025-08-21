"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Download, MapPin, Database, ExternalLink, Star } from "lucide-react"
import { motion, Variants } from "motion/react"

const mockParks = [
  {
    name: "Castle Street Park",
    area: "2.3 hectares",
    type: "Recreation Ground",
    facilities: ["Playground", "Sports Court"],
    rating: 4.5,
    postcode: "BS1 3XD",
  },
  {
    name: "Brandon Hill Nature Park",
    area: "8.5 hectares",
    type: "Nature Reserve",
    facilities: ["Walking Trails", "Cabot Tower"],
    rating: 4.8,
    postcode: "BS1 5RR",
  },
  {
    name: "Queen Square",
    area: "1.2 hectares",
    type: "Urban Square",
    facilities: ["Seating", "Events Space"],
    rating: 4.2,
    postcode: "BS1 4QS",
  },
  {
    name: "Eastville Park",
    area: "34.7 hectares",
    type: "Recreation Ground",
    facilities: ["Lake", "Sports Facilities", "Playground"],
    rating: 4.6,
    postcode: "BS5 6XY",
  },
  {
    name: "The Downs",
    area: "162 hectares",
    type: "Common Land",
    facilities: ["Observatory", "Golf Course", "Walking"],
    rating: 4.9,
    postcode: "BS8 3QD",
  },
]

export function ParksSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  const [resultsCount, setResultsCount] = useState(mockParks.length)

  const handleDownload = () => {
    const csvContent = "data:text/csv;charset=utf-8,Park Name,Type,Area,Rating,Postcode\n"
    const link = document.createElement("a")
    link.setAttribute("href", csvContent)
    link.setAttribute("download", "bristol_parks_data.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Variants for animation
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

  const rowVariants: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: index * 0.05,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }
    })
  }

  const filteredParks = useMemo(() => {
    let filtered = mockParks

    if (searchTerm) {
      filtered = filtered.filter(
        (park) =>
          park.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          park.postcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          park.facilities.some((facility) => facility.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (filterType !== "all") {
      const typeMap: { [key: string]: string[] } = {
        recreation: ["Recreation Ground"],
        nature: ["Nature Reserve", "Common Land"],
        playground: ["Recreation Ground"],
        sports: ["Recreation Ground"],
      }

      if (typeMap[filterType]) {
        filtered = filtered.filter(
          (park) =>
            typeMap[filterType].includes(park.type) ||
            (filterType === "playground" && park.facilities.some((f) => f.toLowerCase().includes("playground"))) ||
            (filterType === "sports" && park.facilities.some((f) => f.toLowerCase().includes("sport"))),
        )
      }
    }

    return filtered
  }, [searchTerm, filterType])

  useEffect(() => {
    setResultsCount(filteredParks.length)
  }, [filteredParks.length])

  const getTypeColor = (type: string) => {
    const colors = {
      "Recreation Ground": "bg-primary/10 text-primary border-primary/20",
      "Nature Reserve": "bg-accent/10 text-accent border-accent/20",
      "Urban Square": "bg-secondary/10 text-secondary-foreground border-border",
      "Common Land": "bg-accent/15 text-accent border-accent/30",
    }
    return colors[type as keyof typeof colors] || "bg-secondary text-secondary-foreground"
  }

  const filterOptions = [
    { value: "all", label: "All Parks", count: mockParks.length },
    { value: "recreation", label: "Recreation Grounds", count: mockParks.filter(p => p.type === "Recreation Ground").length },
    { value: "nature", label: "Nature Reserves", count: mockParks.filter(p => p.type === "Nature Reserve" || p.type === "Common Land").length },
    // These counts are now dynamic
    { value: "playground", label: "Playgrounds", count: mockParks.filter(p => p.facilities.includes("Playground")).length },
    { value: "sports", label: "Sports Facilities", count: mockParks.filter(p => p.facilities.includes("Sports Court") || p.facilities.includes("Sports Facilities")).length },
  ]

  return (
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
              <motion.div
                className="p-2 rounded-lg bg-primary/10"
                whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Search className="h-4 w-4 text-primary" />
              </motion.div>
              <span>Search & Filter Parks</span>
              <motion.div
                className="ml-auto flex items-center gap-1 text-sm font-normal text-muted-foreground"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <MapPin className="h-3 w-3" />
                {resultsCount} found
              </motion.div>
            </CardTitle>
          </motion.div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <motion.div variants={itemVariants} className="flex gap-2">
              <motion.div
                className="flex-1"
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <Input
                  placeholder="Search parks by name, location, or facilities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-input border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 transition-all duration-200"
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-input border-border hover:bg-accent hover:border-accent transition-all duration-200"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>
            <motion.div variants={itemVariants} className="flex gap-2">
              <motion.div
                className="flex-1"
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="bg-input text-foreground border-border hover:border-primary/50 transition-all duration-200">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {filterOptions.map((option) => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className="text-foreground hover:bg-accent focus:bg-accent"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>{option.label}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            {option.count}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-input border-border hover:bg-accent hover:border-accent transition-all duration-200"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.5 }}
              >
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleDownload}
                  className="bg-input border-border hover:bg-accent hover:border-accent transition-all duration-200"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>
          </div>

          <div className="space-y-4">
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-2 h-2 bg-primary rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span>
                  Showing <span className="font-medium text-foreground">{resultsCount}</span> parks
                </span>
              </div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-xs"
              >
                Last updated: August 2025
              </motion.span>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="rounded-md border border-border overflow-hidden"
            >
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-muted/50">
                    <TableHead className="min-w-[150px] text-muted-foreground font-medium">
                      Park Name
                    </TableHead>
                    <TableHead className="min-w-[100px] text-muted-foreground font-medium">
                      Type
                    </TableHead>
                    <TableHead className="min-w-[80px] hidden sm:table-cell text-muted-foreground font-medium">
                      Area
                    </TableHead>
                    <TableHead className="min-w-[80px] text-muted-foreground font-medium">
                      Rating
                    </TableHead>
                    <TableHead className="min-w-[80px] text-muted-foreground font-medium">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredParks.map((park, index) => (
                    <motion.tr
                      key={index}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      custom={index}
                      className="border-border hover:bg-muted/50 transition-colors duration-200"
                    >
                      <TableCell className="min-w-[150px]">
                        <motion.div
                          transition={{ duration: 0.2 }}
                        >
                          <div className="font-medium text-sm md:text-base text-card-foreground">
                            {park.name}
                          </div>
                          <div className="text-xs md:text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {park.postcode}
                          </div>
                        </motion.div>
                      </TableCell>

                      <TableCell className="min-w-[100px]">
                        <motion.div
                          transition={{ duration: 0.2 }}
                        >
                          <Badge
                            variant="outline"
                            className={`text-xs border ${getTypeColor(park.type)}`}
                          >
                            {park.type}
                          </Badge>
                        </motion.div>
                      </TableCell>

                      <TableCell className="min-w-[80px] hidden sm:table-cell text-sm text-card-foreground">
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 + 0.2, duration: 0.3 }}
                        >
                          {park.area}
                        </motion.span>
                      </TableCell>

                      <TableCell className="min-w-[80px]">
                        <motion.div
                          className="flex items-center gap-1"
                          transition={{ duration: 0.2 }}
                        >
                          <motion.div
                            animate={{ rotate: [0, 15, 0] }}
                            transition={{
                              delay: index * 0.1,
                              duration: 0.5,
                              ease: "easeInOut"
                            }}
                          >
                            <Star className="h-3 w-3 md:h-4 md:w-4 fill-yellow-400 text-yellow-400" />
                          </motion.div>
                          <span className="text-sm text-card-foreground font-medium">
                            {park.rating}
                          </span>
                        </motion.div>
                      </TableCell>

                      <TableCell className="min-w-[80px]">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                          whileTap={{ scale: 0.9 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-accent text-muted-foreground hover:text-card-foreground transition-colors duration-200"
                          >
                            <ExternalLink className="h-3 w-3 md:h-4 md:w-4" />
                          </Button>
                        </motion.div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </motion.div>

            {filteredParks.length === 0 && (
              <motion.div
                className="text-center py-8 text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  className="p-4 rounded-lg bg-muted/30 inline-block mb-3"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Database className="h-8 w-8 text-muted-foreground" />
                </motion.div>
                <p className="text-sm">No parks found matching your criteria.</p>
                <p className="text-xs mt-1">Try adjusting your search or filter settings.</p>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}