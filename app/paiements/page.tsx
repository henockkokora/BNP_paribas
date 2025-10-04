'use client'

import { ChevronLeft, Eye, EyeOff } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

export default function PaymentsPage() {
  const [showCardDetails, setShowCardDetails] = useState(false)
  const [showBlockedModal, setShowBlockedModal] = useState(false)
  const [user, setUser] = useState<any>(null)
  
  const cardNumber = "4532 1234 5678 9012"
  const maskedCardNumber = "4532 •••• •••• 9012"
  const expiryDate = "12/26"
  const cvv = "123"

  useEffect(() => {
    // Récupérer les données utilisateur depuis localStorage
    const userData = localStorage.getItem('userData')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/" className="text-gray-600">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Carte Premier</h1>
        </div>

        <div className="relative mb-8">
          <div className="bg-gradient-to-br from-yellow-500 via-yellow-400 to-yellow-600 rounded-2xl shadow-2xl overflow-hidden relative" style={{ aspectRatio: '1.586/1' }}>
            {/* Background patterns - star shapes */}
            <div className="absolute inset-0 opacity-20">
              {/* Large decorative stars */}
              <svg className="absolute top-8 left-8 w-40 h-40 text-yellow-400" viewBox="0 0 100 100">
                <path d="M50 0 L61 39 L100 39 L68 61 L79 100 L50 78 L21 100 L32 61 L0 39 L39 39 Z" fill="currentColor"/>
              </svg>
              <svg className="absolute bottom-0 right-8 w-48 h-48 text-yellow-300" viewBox="0 0 100 100">
                <path d="M50 0 L61 39 L100 39 L68 61 L79 100 L50 78 L21 100 L32 61 L0 39 L39 39 Z" fill="currentColor"/>
              </svg>
              <svg className="absolute top-20 right-20 w-24 h-24 text-yellow-200" viewBox="0 0 100 100">
                <path d="M50 0 L61 39 L100 39 L68 61 L79 100 L50 78 L21 100 L32 61 L0 39 L39 39 Z" fill="currentColor"/>
              </svg>
              
              {/* Hexagonal patterns */}
              <div className="absolute top-16 right-24 w-6 h-6 border border-yellow-200 opacity-40" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
              <div className="absolute top-24 right-36 w-5 h-5 border border-yellow-200 opacity-40" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
              <div className="absolute top-32 right-28 w-4 h-4 border border-yellow-200 opacity-40" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
              <div className="absolute bottom-20 right-16 w-8 h-8 border border-yellow-300 opacity-40" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
              <div className="absolute bottom-28 right-24 w-6 h-6 border border-yellow-300 opacity-40" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}></div>
            </div>

            <div className="relative p-6 h-full flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-teal-700 rounded p-1.5">
                      <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8L12 2Z"/>
                      </svg>
                    </div>
                    <div className="text-white text-base font-bold tracking-wide">
                      BNP PARIBAS
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded p-1.5 w-12">
                    <div className="grid grid-cols-4 gap-[1px]">
                      <div className="bg-yellow-600 h-2"></div>
                      <div className="bg-yellow-600 h-2"></div>
                      <div className="bg-yellow-600 h-2"></div>
                      <div className="bg-yellow-600 h-2"></div>
                      <div className="bg-yellow-600 h-2"></div>
                      <div className="bg-yellow-600 h-2"></div>
                      <div className="bg-yellow-600 h-2"></div>
                      <div className="bg-yellow-600 h-2"></div>
                    </div>
                  </div>
                </div>
                <div className="text-blue-600 text-lg font-bold">
                  VISA
                </div>
              </div>

              <div className="space-y-2">
                
                {showCardDetails && (
                  <div className="space-y-1">
                    <div className="text-white text-xl font-light tracking-[0.3em]">
                      {cardNumber}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-end justify-between">
                <div className="space-y-0">
                  {showCardDetails && (
                    <div className="text-white text-xs mb-1">
                      <div className="text-white/90 text-[9px] leading-tight">EXPIRE</div>
                      <div className="text-white/90 text-[9px] leading-tight">A FIN</div>
                      <div className="font-semibold text-sm">{expiryDate}</div>
                      <div className="text-white/90 text-[9px] leading-tight mt-1">
                        CVV: {cvv}
                      </div>
                    </div>
                  )}
                  <div className="text-white text-base font-semibold tracking-wide">
                    {user?.nom?.toUpperCase() || 'UTILISATEUR'}
                  </div>
                </div>
                <div className="text-white text-sm font-medium px-2 py-1">
                  <span className="text-base">●</span>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
            <button 
              onClick={() => setShowBlockedModal(true)}
              className="bg-teal-600 text-white rounded-full p-3 shadow-lg hover:bg-teal-700 transition-colors"
            >
              {showCardDetails ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              <span className="sr-only">
                {showCardDetails ? "Masquer les détails" : "Afficher les détails"}
              </span>
            </button>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Gestion de la carte
          </h2>

          <Card className="p-5 mb-4 bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
            <div className="flex items-start gap-4">
              <div className="bg-teal-100 rounded-lg p-3 flex-shrink-0">
                <div className="w-8 h-8 text-teal-600">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Faites évoluer votre carte
                </h3>
                <p className="text-xs text-gray-600 mb-3">
                  Profitez de tous les avantages de la gamme supérieure de gamme.
                </p>
              </div>
            </div>
          </Card>

          <h2 className="text-lg font-semibold text-gray-900 mb-4 mt-8">Opposition</h2>

          <div className="grid grid-cols-2 gap-4">
            <Link href="/" className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-gray-200">
                <span className="text-2xl">😊</span>
              </div>
              <span className="text-xs font-medium text-gray-900 text-center">Accueil</span>
            </Link>

            <Link href="/paiements" className="flex flex-col items-center gap-2 p-4 bg-teal-500 rounded-lg hover:bg-teal-600 transition-colors">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl">💳</span>
              </div>
              <span className="text-xs font-medium text-white text-center">Paiements</span>
            </Link>

            <Link href="/decouvrir" className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-gray-200">
                <span className="text-2xl">🔍</span>
              </div>
              <span className="text-xs font-medium text-gray-900 text-center">Découvrir</span>
            </Link>

            <Link href="/contact" className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-gray-200">
                <span className="text-2xl">💬</span>
              </div>
              <span className="text-xs font-medium text-gray-900 text-center">Contact</span>
            </Link>

            <Link href="/profil" className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-gray-200">
                <span className="text-2xl">👤</span>
              </div>
              <span className="text-xs font-medium text-gray-900 text-center">Vous</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Modal Compte bloqué */}
      {showBlockedModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Compte bloqué !</h3>
              <p className="text-gray-600 mb-4">
                Pour voir les informations complètes de votre carte, vous devez d'abord débloquer votre compte.
              </p>
              <div className="bg-red-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700 mb-1">Montant de déblocage requis :</p>
                <p className="text-2xl font-bold text-red-600">{user?.fraisDeblocage?.toFixed(2) || '0.00'} €</p>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Contactez votre conseiller pour débloquer votre compte et accéder à toutes les fonctionnalités de votre carte.
              </p>
              <button
                onClick={() => setShowBlockedModal(false)}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
              >
                Compris
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}