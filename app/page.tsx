"use client"

import { ParksHeader } from "@/components/parks-header"
import { ParksStats } from "@/components/parks-stats"
import { ParksSearch } from "@/components/parks-search"
import { ParksFooter } from "@/components/parks-footer"
import { ThemeToggle } from "@/components/theme-toggle"
import dynamic from 'next/dynamic'

const ParksMap = dynamic(() => import("@/components/parks-map").then(mod => ({ default: mod.ParksMap })), {
  ssr: false,
  loading: () => <div className="h-96 bg-muted animate-pulse rounded-lg" />
})

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ParksHeader />

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

      <div className="fixed bottom-6 right-6 z-50">
        <ThemeToggle />
      </div>
    </div>
  )
}