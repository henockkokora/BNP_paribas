'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Chrome as Home, CreditCard, Compass, MessageSquare, User } from 'lucide-react'

const navItems = [
  { href: '/', icon: Home, label: 'Accueil' },
  { href: '/paiements', icon: CreditCard, label: 'Paiements' },
  { href: '/decouvrir', icon: Compass, label: 'Découvrir' },
  { href: '/contact', icon: MessageSquare, label: 'Contact' },
  { href: '/profil', icon: User, label: 'Vous' }
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-colors ${
                isActive
                  ? 'text-teal-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
