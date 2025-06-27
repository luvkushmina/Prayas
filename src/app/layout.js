import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'PWApp',
  description: 'PRAYASS',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body className={inter.className}>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-papapapap..." // Replace with full real integrity string
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        {children}
      </body>
    </html>
  )
}

