import { ExternalLink, FileText, Database, Leaf } from "lucide-react"
import { motion, Variants } from "motion/react"

export function ParksFooter() {
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }

  return (
    <motion.footer
      className="bg-card border-t border-border/60 mt-16"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="container mx-auto px-4 py-12">
        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-2 mb-4">
              <motion.div
                className="p-2 rounded-lg bg-primary/10"
                whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Database className="h-4 w-4 text-primary" />
              </motion.div>
              <h3 className="font-semibold text-card-foreground">Data Sources</h3>
            </div>
            <div className="space-y-3">
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <a
                  href="https://www.data.gov.uk/dataset/4f190983-66c3-4692-b1b3-742e7b01bbd1/bristol-parks-green-space-strategy-sites"
                  className="group flex items-start gap-2 text-sm text-primary hover:text-accent transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="leading-relaxed">Bristol Parks & Green Space Strategy Sites</span>
                  <ExternalLink className="h-3 w-3 mt-0.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                </a>
                <p className="text-xs text-muted-foreground mt-1 ml-0">Official government dataset</p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-2 mb-4">
              <motion.div
                className="p-2 rounded-lg bg-accent/10"
                whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
              >
                <FileText className="h-4 w-4 text-accent" />
              </motion.div>
              <h3 className="font-semibold text-card-foreground">References</h3>
            </div>
            <div className="space-y-3">
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <a
                  href="https://www.bristol.gov.uk/residents/museums-parks-sports-and-culture/parks-and-open-spaces"
                  className="group flex items-start gap-2 text-sm text-primary hover:text-accent transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="leading-relaxed">Bristol Parks Information</span>
                  <ExternalLink className="h-3 w-3 mt-0.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                </a>
              </motion.div>
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <a
                  href="https://www.bristol.gov.uk/council/policies-plans-and-strategies/parks-and-open-spaces/bristol-parks-and-green-space-strategy"
                  className="group flex items-start gap-2 text-sm text-primary hover:text-accent transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="leading-relaxed">Parks Strategy 2024-2039</span>
                  <ExternalLink className="h-3 w-3 mt-0.5 opacity-70 group-hover:opacity-100 transition-opacity" />
                </a>
              </motion.div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-2 mb-4">
              <motion.div
                className="p-2 rounded-lg bg-primary/5"
                whileHover={{ scale: 1.05, rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Leaf className="h-4 w-4 text-primary" />
              </motion.div>
              <h3 className="font-semibold text-card-foreground">Academic Context</h3>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground leading-relaxed">
              <p>University of the West of England, Bristol</p>
              <p>Data Visualization Prototype</p>
              <p>Non-commercial academic use</p>
              <motion.p
                className="text-xs opacity-70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                Last updated: August 20, 2025
              </motion.p>
            </div>
          </motion.div>
        </div>

        {/* Bottom section */}
        <motion.div
          className="border-t border-border/40 pt-6"
          variants={itemVariants}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Leaf className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">
                © 2025 Bristol Parks Data Visualization
              </span>
            </motion.div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Academic Prototype</span>
              <span>•</span>
              <span>Data: Bristol City Council</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  )
}