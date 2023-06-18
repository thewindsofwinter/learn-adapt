import './globals.css'
// import { Inter } from 'next/font/google'

// const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Interview Insights',
  description: 'Teach the AI, then let the AI teach you.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body /*className={inter.className}*/>{children}</body>
    </html>
  )
}
