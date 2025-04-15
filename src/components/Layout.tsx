// 📁 src/components/Layout.tsx
import { ReactNode } from 'react'
import Sidebar from './Sidebar'
import Footer from './Footer'
import './Layout.css'

type LayoutProps = {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="layout-wrapper">
      <Sidebar />
      <div className="main-content">
        <div className="page-content">
          {children}
        </div>
        <Footer />
      </div>
    </div>
  )
}
