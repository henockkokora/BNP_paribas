'use client'

import { usePathname } from 'next/navigation'
import { BottomNav } from './bottom-nav'
import { useEffect } from 'react'

export function ConditionalNav() {
  const pathname = usePathname()
  const hideNav = pathname === '/login' || pathname === '/code-secret' || pathname.startsWith('/admin')
  
  // Ajouter/enlever le padding du main en fonction de la navigation
  useEffect(() => {
    const main = document.querySelector('main')
    if (main) {
      if (hideNav) {
        main.classList.remove('pb-20')
      } else {
        main.classList.add('pb-20')
      }
    }
  }, [hideNav])
  
  // Ne pas afficher la navigation sur les pages de login et admin
  if (hideNav) {
    return null
  }
  
  return <BottomNav />
}

