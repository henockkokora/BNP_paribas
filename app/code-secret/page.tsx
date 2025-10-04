'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useNotifications } from '@/hooks/useNotifications'

export default function CodeSecretPage() {
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { showError, showSuccess } = useNotifications()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (code.length !== 4) {
      showError('Code invalide', 'Le code secret doit contenir exactement 4 chiffres')
      return
    }

    setIsLoading(true)

    try {
      // Vérifier le code secret via l'API backend
      const response = await fetch(`http://localhost:5000/api/user-by-code/${code}`)
      
      if (response.ok) {
        const user = await response.json()
        
        // Vérifier si l'utilisateur n'est pas expiré
        const dateFin = new Date(user.dateFin)
        const maintenant = new Date()
        
        if (maintenant > dateFin) {
          showError('Compte expiré', 'Votre compte a expiré. Contactez l\'administrateur.')
          setIsLoading(false)
          return
        }
        
        // Stocker les informations utilisateur
        localStorage.setItem('userData', JSON.stringify(user))
        localStorage.setItem('userCode', code)
        
        showSuccess('Connexion réussie', `Bienvenue ${user.nom}`)
        
        // Redirection vers le dashboard
        window.location.href = '/dashboard'
      } else {
        const error = await response.json()
        
        // Gérer spécifiquement l'erreur de suspension
        if (response.status === 403) {
          showError('Compte suspendu', error.error || 'Votre compte a été suspendu. Contactez votre conseiller.')
        } else {
          showError('Code invalide', error.error || 'Code secret incorrect')
        }
        
        setIsLoading(false)
      }
    } catch (error) {
      showError('Erreur de connexion', 'Impossible de se connecter au serveur')
      setIsLoading(false)
    }
  }

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
      <div className="relative z-10 flex flex-col min-h-screen px-6 py-6">
        {/* Header with back arrow */}
        <div className="flex justify-between items-center pt-4 pb-8">
          <Link href="/login" className="p-2">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div></div>
        </div>

        {/* Content centered */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-sm">
            <h1 className="text-white text-2xl font-bold text-center mb-8">
              Saisissez votre code secret pour accéder à vos comptes
            </h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="password"
                  value={code}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '')
                    if (value.length <= 4) {
                      setCode(value)
                    }
                  }}
                  placeholder="Code secret"
                  className="w-full px-4 py-4 bg-white/90 rounded-lg border-0 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 text-center text-lg font-semibold tracking-widest"
                  maxLength={4}
                />
              </div>
              
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#1a9d55] text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-[#168f4a] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Connexion...
                  </div>
                ) : (
                  'Valider'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
