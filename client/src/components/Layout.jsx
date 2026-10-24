import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children, hideFooter = false }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  )
}
