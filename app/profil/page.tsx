'use client'

import { useState, useEffect } from 'react'
import { ChevronRight, ChevronDown, User, Settings, Bell, Lock, CircleHelp as HelpCircle, LogOut } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { useNotifications } from '@/hooks/useNotifications'

export default function ProfilePage() {
  const router = useRouter()
  const { showInfo } = useNotifications()
  const [expandedSection, setExpandedSection] = useState<number | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Récupérer les données utilisateur depuis localStorage
    const userData = localStorage.getItem('userData')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleLogout = () => {
    // Nettoyer le localStorage
    localStorage.removeItem('userData')
    localStorage.removeItem('userCode')
    
    showInfo('Déconnexion', 'Vous avez été déconnecté avec succès')
    router.push('/login')
  }

  const menuItems = [
    {
      icon: User,
      label: 'Informations personnelles',
      description: 'Gérez vos données personnelles',
      content: [
        { label: 'Nom complet', value: user?.nom || 'Utilisateur' },
        { label: 'Ville', value: user?.ville || 'Non renseignée' },
        { label: 'Email', value: `${user?.nom?.toLowerCase().replace(/\s+/g, '') || 'utilisateur'}@gmail.com` },
        { label: 'Code secret', value: user?.codeSecret || '****' }
      ]
    },
    {
      icon: Settings,
      label: 'Paramètres',
      description: 'Personnalisez votre expérience',
      content: [
        { label: 'Langue', value: 'Français' },
        { label: 'Devise', value: 'EUR (€)' },
        { label: 'Thème', value: 'Clair' },
        { label: 'Notifications push', value: 'Activées' },
        { label: 'Notifications email', value: 'Activées' },
        { label: 'Touch ID / Face ID', value: 'Activé' }
      ]
    },
    {
      icon: Bell,
      label: 'Notifications',
      description: 'Gérez vos alertes et notifications',
      content: [
        { label: 'Transactions', value: 'Toutes les transactions' },
        { label: 'Seuil d\'alerte', value: 'Transactions > 100€' },
        { label: 'Rappels de paiement', value: 'Activés' },
        { label: 'Conseils bancaires', value: 'Activés' },
        { label: 'Offres promotionnelles', value: 'Désactivées' },
        { label: 'Alertes de sécurité', value: 'Activées' }
      ]
    },
    {
      icon: Lock,
      label: 'Sécurité',
      description: 'Protégez votre compte',
      content: [
        { label: 'Authentification à deux facteurs', value: 'Activée' },
        { label: 'Biométrie', value: 'Face ID activé' },
        { label: 'Code PIN', value: '••••' },
        { label: 'Dernière connexion', value: 'Aujourd\'hui à 09:45' },
        { label: 'Appareils connectés', value: '2 appareils' },
        { label: 'Changement de mot de passe', value: 'Il y a 45 jours' }
      ]
    },
    {
      icon: HelpCircle,
      label: 'Aide et support',
      description: 'Obtenez de l\'aide',
      content: [
        { label: 'Centre d\'aide', value: 'Accéder aux FAQ' },
        { label: 'Chat en direct', value: 'Disponible 24/7' },
        { label: 'Email support', value: 'BNPsupport@gmail.com' },
        { label: 'Rendez-vous conseiller', value: 'Prendre RDV' },
        { label: 'Tutoriels vidéo', value: 'Voir les guides' }
      ]
    }
  ]

  const toggleSection = (index: number) => {
    setExpandedSection(expandedSection === index ? null : index)
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profil</h1>

        <Card className="p-6 mb-6 bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.nom ? user.nom.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900">{user?.nom || 'Utilisateur'}</h2>
              <p className="text-sm text-gray-600">{user?.nom?.toLowerCase().replace(/\s+/g, '') || 'utilisateur'}@gmail.com</p>
              <p className="text-xs text-teal-600 mt-1 font-medium">Client Premium</p>
            </div>
          </div>
        </Card>

        <div className="space-y-3 mb-8">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            const isExpanded = expandedSection === index

            return (
              <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection(index)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-teal-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.description}</p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3 bg-gray-50 border-t border-gray-200">
                    {item.content.map((field, fieldIndex) => (
                      <div key={fieldIndex} className="flex items-center justify-between py-2">
                        <span className="text-xs text-gray-600">{field.label}</span>
                        <span className="text-xs font-medium text-gray-900">{field.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-red-600 font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>Se déconnecter</span>
        </button>

      </div>
    </div>
  )
}
