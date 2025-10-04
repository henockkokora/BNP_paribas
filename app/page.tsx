'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-image-mobile">
      {/* Background Image - optimized for mobile */}
      <div className="absolute inset-0">
        <Image
          src="/page d'accueil - Edited.jpg"
          alt="BNP Paribas Background"
          fill
          className="object-cover object-center"
          style={{ 
            objectPosition: 'center top',
            minHeight: '100vh',
            width: '100%',
            height: '100%'
          }}
          priority
          sizes="100vw"
          quality={85}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen px-8 py-6">
        {/* Spacer to push buttons up */}
        <div className="flex-1"></div>

        {/* Buttons Section - Higher position */}
        <div className="w-full px-6 space-y-4 mb-32">
          <Link href="/dashboard" className="block">
            <button className="w-full bg-[#1a9d55] text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-[#168f4a] transition-colors shadow-lg">
              Accéder à mes comptes
              </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
