import Link from 'next/link'
import '../styles/globals.scss'

export const metadata = {
  title: 'Word Search MVP',
  description: 'A word search application with linguistic relations',
}

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="header">
            <div className="header-content">
              <Link href="/" className="logo">Word Search</Link>
              <nav className="nav">
                <Link href="/">Search</Link>
                <Link href="/about">About</Link>
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


