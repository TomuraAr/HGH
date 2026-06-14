import './globals.css'

export const metadata = {
  title: 'HGH System | Asset Matrix',
  description: 'Institutional Gradient Harvester Assessment',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  )
}