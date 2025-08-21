import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trees, Users, MapPin, Award } from "lucide-react"
import { motion, Variants } from "motion/react"

export function ParksStats() {
  const stats = [
    {
      title: "Total Parks",
      value: "127",
      icon: Trees,
      description: "Green spaces across Bristol",
      color: "text-primary",
      bgColor: "bg-primary/15",
    },
    {
      title: "Total Area",
      value: "2,847",
      unit: "hectares",
      icon: MapPin,
      description: "Protected green space",
      color: "text-accent",
      bgColor: "bg-accent/15",
    },
    {
      title: "Annual Visitors",
      value: "1.2M",
      icon: Users,
      description: "Estimated park usage",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Quality Rating",
      value: "4.2/5",
      icon: Award,
      description: "Average park quality",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ]

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