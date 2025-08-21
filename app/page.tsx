"use client"

import { ParksHeader } from "@/components/parks-header"
import { ParksStats } from "@/components/parks-stats"
import { ParksMap } from "@/components/parks-map"
import { ParksSearch } from "@/components/parks-search"
import { ParksFooter } from "@/components/parks-footer"
import { ThemeToggle } from "@/components/theme-toggle"

export default function HomePage() {

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ParksHeader />

      {/* Add top padding to the main content area to prevent it from being hidden
        behind the fixed header. The 'pt-32' class ensures a safe margin.
      */}
      <main className="container mx-auto px-4 pt-32 pb-8 space-y-8 flex-1">
        <ParksStats />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="space-y-6 order-2 xl:order-1">
            <ParksSearch />
          </div>

          <div className="order-1 xl:order-2">
            <ParksMap />
          </div>
        </div>
      </main>

      <ParksFooter />

      {/* Theme toggle positioned fixed */}
      <div className="fixed bottom-6 right-6 z-50">
        <ThemeToggle />
      </div>
    </div>
  )
}