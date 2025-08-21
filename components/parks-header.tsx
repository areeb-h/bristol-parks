"use client"

import { useState, useEffect } from "react"
import { Leaf, Menu, Search, Bell, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "motion/react"

export function ParksHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const navItems = [
    { name: "Overview", active: true },
    { name: "Parks Directory", active: false },
    { name: "Facilities", active: false },
    { name: "Events", active: false },
    { name: "Conservation", active: false },
  ]

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 glass-header border-b border-border/50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="transition-all duration-300 ease-out"
          animate={{ paddingTop: isScrolled ? "0.5rem" : "1rem", paddingBottom: isScrolled ? "0.5rem" : "1rem" }}
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              {/* Logo and Brand */}
              <motion.div
                className="flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Leaf className="h-6 w-6 text-primary" />
                  </motion.div>
                  {/*
                    The change is here: remove 'hidden' class to show on all screen sizes.
                    Adjust font size for better mobile display.
                  */}
                  <div>
                    <motion.h1
                      className="text-lg sm:text-xl font-bold"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      <span className="text-foreground">Bristol </span>
                      <span className="text-gradient-park">Parks</span>
                    </motion.h1>
                  </div>
                </div>
              </motion.div>

              {/* Navigation Links (Desktop) */}
              <nav className="hidden lg:flex items-center gap-8">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href="#"
                    className={`relative text-sm font-medium transition-colors duration-300 group ${item.active ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index + 0.3, duration: 0.4 }}
                    whileHover={{ y: -2 }}
                  >
                    {item.name}
                    <motion.div
                      className="absolute inset-x-0 -bottom-1 h-0.5 bg-accent origin-left"
                      initial={{ scaleX: item.active ? 1 : 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.a>
                ))}
              </nav>

              {/* Actions */}
              <div className="flex items-center gap-2 md:gap-4">
                {/* Search bar */}
                <motion.div
                  className="hidden lg:flex relative w-64"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "16rem" }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Input
                    placeholder="Search..."
                    className="bg-card/40 border-border/50 text-foreground placeholder:text-muted-foreground focus:bg-card/60 transition-all duration-200"
                  />
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 text-muted-foreground hover:text-foreground hover:bg-primary/10"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Action buttons */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-muted-foreground hover:text-foreground hover:bg-primary/10 p-2 relative"
                    >
                      <Bell className="h-5 w-5" />
                      <motion.div
                        className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full border border-border/30"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </Button>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="hidden sm:flex text-muted-foreground hover:text-foreground hover:bg-primary/10 p-2"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Mobile menu button */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="lg:hidden text-muted-foreground hover:text-foreground hover:bg-primary/10 p-2"
                      onClick={toggleMobileMenu}
                    >
                      {isMobileMenuOpen ? (
                        <X className="h-5 w-5" />
                      ) : (
                        <Menu className="h-5 w-5" />
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dynamic scroll indicator */}
        <motion.div
          className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-primary/20 via-accent/30 to-primary/20"
          initial={{ width: 0, opacity: 0 }}
          animate={{
            width: isScrolled ? "100%" : 0,
            opacity: isScrolled ? 1 : 0,
          }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 pt-20 bg-background/95 backdrop-blur-2xl z-40 p-4 overflow-y-auto"
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="container mx-auto space-y-6">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search parks..."
                  className="flex-1 bg-card/60 border-border/50 text-foreground placeholder:text-muted-foreground focus:bg-card/80 transition-all duration-200"
                />
              </div>

              <nav className="flex flex-col gap-2">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href="#"
                    className={`block text-lg font-semibold px-4 py-3 rounded-lg transition-colors duration-200 ${item.active ? "text-primary bg-primary/10" : "text-foreground hover:bg-primary/5"}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    onClick={toggleMobileMenu}
                  >
                    {item.name}
                  </motion.a>
                ))}
              </nav>

              <motion.div
                className="pt-4 border-t border-border/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <Button
                  variant="outline"
                  className="w-full bg-transparent border-border/50 text-foreground hover:bg-primary/10 justify-start"
                >
                  <User className="h-4 w-4 mr-2" />
                  <span>My Profile</span>
                </Button>
                <Button
                  variant="outline"
                  className="w-full mt-2 bg-transparent border-border/50 text-foreground hover:bg-primary/10 justify-start"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  <span>Notifications</span>
                </Button>
              </motion.div>
            </div>

            {/* A transparent overlay to close the menu when clicked outside */}
            <div
              className="absolute inset-0 top-20"
              onClick={toggleMobileMenu}
              aria-hidden="true"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}