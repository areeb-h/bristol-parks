import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { ThemeProvider } from "next-themes"

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),

  title: {
    default: "Bristol Parks & Green Spaces",
    template: "%s | Bristol Parks"
  },

  description:
    "Data visualization and management system for Bristol parks and green spaces.",

  alternates: {
    canonical: "https://example.com",
    languages: {
      "en-US": "https://example.com/en-US"
    }
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  },

  openGraph: {
    title: "Bristol Parks & Green Spaces",
    description:
      "Explore green spaces in Bristol through interactive maps and data.",
    url: "https://example.com",
    siteName: "Bristol Parks App",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bristol Parks overview",
        type: "image/png"
      }
    ],
    locale: "en_US",
    type: "website"
  },

  twitter: {
    card: "summary_large_image",
    title: "Bristol Parks & Green Spaces",
    description:
      "Browse and manage Bristol's parks via this interactive app.",
    images: ["/og-image.png"],
    creator: "@bristolparks",
    site: "@bristolparks"
  },

  other: {
    pinterest: "nopin"
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className={GeistSans.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
