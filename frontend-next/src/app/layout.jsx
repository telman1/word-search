import '../styles/globals.scss'
import { LanguageProvider } from '../contexts/LanguageContext'
import Header from '../components/Header'

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
        <LanguageProvider>
          <div className="container">
            <Header />
            <main>
              {children}
            </main>
          </div>
        </LanguageProvider>
      </body>
    </html>
  )
}


