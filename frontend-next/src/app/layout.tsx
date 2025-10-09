import type { Metadata } from 'next'
import '../styles/globals.scss'

export const metadata: Metadata = {
  title: 'Word Search MVP',
  description: 'A word search application with linguistic relations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="header">
            <div className="header-content">
              <a href="/" className="logo">Word Search</a>
              <nav className="nav">
                <a href="/">Search</a>
                <a href="/about">About</a>
              </nav>
            </div>
          </header>
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
