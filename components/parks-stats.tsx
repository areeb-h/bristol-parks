"use client"

// Core React and state management
import { useState, useMemo, useEffect } from "react"

// UI components from Shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Icons from Lucide React
import { Trees, Users, MapPin, Award, Loader2 } from "lucide-react"

// Motion for animations
import { motion, Variants, AnimatePresence } from "framer-motion"

// Function to manually parse CSV data without an external library
function parseCsv(csvData: string): any[] {
  const lines = csvData.trim().split('\n');
  const headers = lines[0].split(',').map(header => header.trim());
  const rows = lines.slice(1).map(line => {
    const values = line.split(',');
    return headers.reduce((obj, header, index) => {
      (obj as any)[header] = values[index].trim();
      return obj;
    }, {});
  });
  return rows;
}

export function ParksStats() {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to generate a simulated rating based on data
  const generateRating = (majorSite: string, area: number): number => {
    let rating = 3.5;
    if (majorSite === 'Yes') rating += 0.8;
    if (area > 10000) rating += 0.4;
    if (area > 50000) rating += 0.3;
    return Math.min(Math.round(rating * 10) / 10, 5.0);
  };

  useEffect(() => {
    const loadAndCalculateStats = async () => {
      try {
        setLoading(true);

        const response = await fetch('/Parks_and_green_spaces.csv');
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const csvData = await response.text();
        const parsedData = parseCsv(csvData);

        let totalParks = 0;
        let totalAreaSqM = 0;
        let totalRatingSum = 0;

        // Filter and process data
        const filteredData = parsedData.filter((row: any) => row.SITE_NAME);

        filteredData.forEach(row => {
          totalParks++;
          const area = parseFloat(row.FEATURE_AREA) || 0;
          const majorSite = row.MAJOR_SITE || 'No';

          totalAreaSqM += area;
          totalRatingSum += generateRating(majorSite, area);
        });

        const totalAreaHa = (totalAreaSqM / 10000).toFixed(0);
        const averageRating = (totalRatingSum / totalParks).toFixed(1);

        const newStats = [
          {
            title: "Total Parks",
            value: totalParks.toLocaleString(),
            icon: Trees,
            description: "Green spaces across Bristol",
            color: "text-primary",
            bgColor: "bg-primary/15",
          },
          {
            title: "Total Area",
            value: totalAreaHa,
            unit: "hectares",
            icon: MapPin,
            description: "Protected green space",
            color: "text-accent",
            bgColor: "bg-accent/15",
          },
          {
            title: "Annual Visitors",
            value: "1.2M",
            color: "text-primary",
            bgColor: "bg-primary/10",
          },
          {
            title: "Quality Rating",
            value: `${averageRating}/5`,
            icon: Award,
            description: "Average park quality",
            color: "text-accent",
            bgColor: "bg-accent/10",
          },
        ];
        setStats(newStats);

      } catch (error) {
        console.error('Error loading parks data:', error);
        // Fallback to mock data or show error state
        setStats([
          { title: "Total Parks", value: "N/A", icon: Trees, description: "Could not load data", color: "text-gray-400", bgColor: "bg-gray-100" },
          { title: "Total Area", value: "N/A", icon: MapPin, description: "Could not load data", color: "text-gray-400", bgColor: "bg-gray-100" },
          { title: "Annual Visitors", value: "N/A", icon: Users, description: "Could not load data", color: "text-gray-400", bgColor: "bg-gray-100" },
          { title: "Quality Rating", value: "N/A", icon: Award, description: "Could not load data", color: "text-gray-400", bgColor: "bg-gray-100" },
        ]);
      } finally {
        setLoading(false);
      }
    };
    loadAndCalculateStats();
  }, []);

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
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  if (loading) {
    return (
      <Card className="bg-card shadow-none border-border/60">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Calculating statistics...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <Card className="bg-card shadow-none  border-border/60 hover:border-border transition-all duration-300">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:divide-x divide-border/50">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  scale: 1.02,
                  transition: { duration: 0.2, ease: "easeOut" }
                }}
                className="flex flex-col items-center text-center first:pt-0"
              >
                <motion.div
                  className={`p-3 rounded-xl ${stat.bgColor} mb-3`}
                  whileHover={{
                    scale: 1.1,
                    rotate: [0, -10, 10, 0],
                    transition: { duration: 0.5, ease: "easeInOut" }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </motion.div>
                <motion.div
                  className="text-2xl font-bold text-card-foreground mb-1"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.4, ease: "backOut" }}
                >
                  {stat.value}
                  {stat.unit && <span className="text-sm font-normal text-muted-foreground ml-1">{stat.unit}</span>}
                </motion.div>
                <motion.h3
                  className="text-sm font-medium text-card-foreground mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.4, duration: 0.3 }}
                >
                  {stat.title}
                </motion.h3>
                <motion.p
                  className="text-xs text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.5, duration: 0.3 }}
                >
                  {stat.description}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
