'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useNotifications } from '@/hooks/useNotifications'

interface User {
  _id: string
  nom: string
  fraisDeblocage: number
  solde: number
  codeSecret: string
  dateDebut: string
  dateFin: string
  dureeMois: number
}

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [redirecting, setRedirecting] = useState(false)
  const [showVirementModal, setShowVirementModal] = useState(false)
  const [showHistorique, setShowHistorique] = useState(false)
  const { showError, showSuccess, showInfo } = useNotifications()

  useEffect(() => {
    // Vérifier immédiatement si l'utilisateur est connecté
    const userData = localStorage.getItem('userData')
    const userCode = localStorage.getItem('userCode')
    
    if (!userData || !userCode) {
      // Pas de données utilisateur, rediriger immédiatement
      setRedirecting(true)
      router.replace('/login')
      return
    }

    try {
      const parsedUser: User = JSON.parse(userData)
      
      // Vérifier si le compte n'est pas expiré
      const dateFin = new Date(parsedUser.dateFin)
      const maintenant = new Date()
      
      if (maintenant > dateFin) {
        // Compte expiré, nettoyer le localStorage et rediriger
        localStorage.removeItem('userData')
        localStorage.removeItem('userCode')
        showError('Compte expiré', 'Votre compte a expiré. Contactez l\'administrateur.')
        setRedirecting(true)
        router.replace('/login')
        return
      }
      
      setUser(parsedUser)
      setLoading(false)
    } catch (error) {
      // Erreur de parsing, nettoyer et rediriger
      localStorage.removeItem('userData')
      localStorage.removeItem('userCode')
      showError('Erreur', 'Session invalide')
      setRedirecting(true)
      router.replace('/login')
    }
  }, [router, showError])

  const handleLogout = () => {
    // Nettoyer le localStorage
    localStorage.removeItem('userData')
    localStorage.removeItem('userCode')
    
    showInfo('Déconnexion', 'Vous avez été déconnecté avec succès')
    router.replace('/login')
  }

  if (redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirection...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos informations...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Utilisateur non trouvé</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Badge Compte bloqué */}
      <div className="px-4 py-4">
        <div className="bg-red-100 border border-red-200 rounded-xl p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-red-800">Compte bloqué</h3>
              <p className="text-xs text-red-600">Votre compte nécessite un déblocage pour accéder à toutes les fonctionnalités</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section Budget */}
      <div className="px-4 py-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Budget</h2>
            <span className="text-sm text-gray-500">{new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Compte de chèques N° **** {user.codeSecret}</p>
          </div>

          {/* Frais de déblocage */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Frais de déblocage</span>
            </div>
            <div className="text-2xl font-bold text-red-600 mb-2">
              {user.fraisDeblocage.toFixed(2)} €
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>

          {/* Solde */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Solde</span>
            </div>
            <div className="text-2xl font-bold text-green-600 mb-2">
              {user.solde.toFixed(2)} €
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-400 h-2 rounded-full" style={{ width: '80%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Actions rapides */}
      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Actions rapides</h2>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Logo Virement */}
            <div 
              className="flex flex-col items-center p-4 bg-blue-50 rounded-xl cursor-pointer hover:bg-blue-100 transition-colors"
              onClick={() => setShowVirementModal(true)}
            >
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">Virement</span>
            </div>

            {/* Logo Historique */}
            <div 
              className="flex flex-col items-center p-4 bg-green-50 rounded-xl cursor-pointer hover:bg-green-100 transition-colors"
              onClick={() => setShowHistorique(!showHistorique)}
            >
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">Historique</span>
            </div>
          </div>
        </div>
      </div>

      {/* Liste Historique */}
      {showHistorique && (
        <div className="px-4 py-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Historique des virements</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">Virement reçu - Salaire</p>
                  <p className="text-xs text-gray-500">15/05/2025</p>
                </div>
                <span className="text-sm font-bold text-green-600">+2500.00 €</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">Prélèvement EDF</p>
                  <p className="text-xs text-gray-500">22/04/2025</p>
                </div>
                <span className="text-sm font-bold text-red-600">-85.50 €</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">Virement vers compte épargne</p>
                  <p className="text-xs text-gray-500">20/03/2025</p>
                </div>
                <span className="text-sm font-bold text-red-600">-500.00 €</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">Retrait DAB</p>
                  <p className="text-xs text-gray-500">18/02/2025</p>
                </div>
                <span className="text-sm font-bold text-red-600">-100.00 €</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-900">Virement reçu - Prime</p>
                  <p className="text-xs text-gray-500">15/01/2025</p>
                </div>
                <span className="text-sm font-bold text-green-600">+300.00 €</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">Prélèvement Internet</p>
                  <p className="text-xs text-gray-500">12/01/2025</p>
                </div>
                <span className="text-sm font-bold text-red-600">-29.99 €</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section Empreinte carbone */}
      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Empreinte carbone</h2>
            <span className="text-sm text-gray-500">{new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
          </div>
          
          <div className="text-2xl font-bold text-gray-900 mb-4">
            300 kg de CO2
          </div>
          
          {/* Graphique dynamique jusqu'au mois actuel */}
          <div className="flex items-end space-x-3">
            {(() => {
              const moisActuel = new Date().getMonth(); // 0-11 (janvier = 0)
              const nomsMois = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
              const couleurs = ['green-200', 'green-300', 'green-400', 'green-300', 'green-500', 'green-600', 'green-700', 'green-800', 'green-600', 'green-500', 'green-400', 'green-300'];
              const hauteurs = [40, 50, 60, 55, 70, 80, 90, 85, 75, 65, 55, 45];
              
              return nomsMois.slice(0, moisActuel + 1).map((mois, index) => (
                <div key={mois} className="flex flex-col items-center">
                  <div 
                    className={`w-6 bg-${couleurs[index]} rounded-t`} 
                    style={{ height: `${hauteurs[index]}px` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2">{mois}</span>
                </div>
              ));
            })()}
            <div className="flex flex-col items-center ml-2">
              <span className="text-xs text-gray-500">1t</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Virement */}
      {showVirementModal && (
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
                Votre compte est temporairement bloqué. Pour effectuer des virements, vous devez d'abord débloquer votre compte.
              </p>
              <div className="bg-red-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700 mb-1">Montant de déblocage requis :</p>
                <p className="text-2xl font-bold text-red-600">{user.fraisDeblocage.toFixed(2)} €</p>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Contactez votre conseiller pour débloquer votre compte et retrouver toutes vos fonctionnalités.
              </p>
              <button
                onClick={() => setShowVirementModal(false)}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
              >
                Compris
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation en bas */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around py-2">
          <div className="flex flex-col items-center py-2">
            <div className="w-6 h-6 mb-1">
              <svg className="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <span className="text-xs text-gray-500">Paiements</span>
          </div>
          
          <div className="flex flex-col items-center py-2">
            <div className="w-6 h-6 mb-1">
              <svg className="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <span className="text-xs text-gray-500">Découvrir</span>
          </div>
          
          <div className="flex flex-col items-center py-2">
            <div className="w-6 h-6 mb-1">
              <svg className="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
              </svg>
            </div>
            <span className="text-xs text-gray-500">Contact</span>
          </div>
          
          <div className="flex flex-col items-center py-2">
            <div className="w-6 h-6 mb-1">
              <svg className="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <span className="text-xs text-gray-500">Vous</span>
          </div>
        </div>
      </div>
    </div>
  )
}
