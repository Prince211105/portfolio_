import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'PortfolioForge — Build Your Portfolio with AI',
  description: 'Create a stunning professional portfolio website in minutes. No coding required.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#08080d] text-[#edeae4] antialiased overflow-x-hidden">
        <Providers>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#13131e',
                color: '#edeae4',
                border: '1px solid rgba(201,168,76,0.3)',
                borderRadius: '10px',
                fontSize: '0.875rem',
              },
              success: { iconTheme: { primary: '#c9a84c', secondary: '#08080d' } },
              error: { iconTheme: { primary: '#f43f5e', secondary: '#fff' } },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
