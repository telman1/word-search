import '../styles/globals.scss'
import { LanguageProvider } from '../contexts/LanguageContext'
import Footer from '../components/Footer'
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
          <div className="container layout-shell">
            <Header />
            <main>
              {children}
            </main>
            <Footer />
          </div>
        </LanguageProvider>
      </body>
    </html>
  )
}


