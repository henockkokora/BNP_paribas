'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useNotifications } from '@/hooks/useNotifications'
import { API_URL } from '@/lib/config'

interface User {
  _id: string
  nom: string
  ville: string
  fraisDeblocage: number
  solde: number
  codeSecret: string
  dateDebut: string
  dateFin: string
  dureeMois: number
  suspendu: boolean
}

type TabType = 'overview' | 'users'

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [showAddForm, setShowAddForm] = useState(false)
  const [showRenewModal, setShowRenewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showSuspendModal, setShowSuspendModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [renewDuration, setRenewDuration] = useState(12)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [editUser, setEditUser] = useState({
    nom: '',
    ville: '',
    fraisDeblocage: '',
    solde: '',
    codeSecret: '',
    dureeMois: 12
  })
  const [newUser, setNewUser] = useState({
    nom: '',
    ville: '',
    fraisDeblocage: '',
    solde: '',
    codeSecret: '',
    dureeMois: 12
  })
  const router = useRouter()
  const { showSuccess, showError, showInfo } = useNotifications()

  useEffect(() => {
    // Vérifier si l'admin est connecté avec token JWT
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.replace('/admin/login')
      return
    }

    setIsAuthenticated(true)
    // Charger les utilisateurs depuis l'API backend
    loadUsers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`${API_URL}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const users = await response.json()
        setUsers(users)
      } else {
        showError('Erreur', 'Impossible de charger les utilisateurs')
      }
    } catch (error) {
      showError('Erreur', 'Impossible de se connecter au serveur')
    }
  }

  const handleAddUser = async () => {
    // Validation des champs obligatoires
    if (!newUser.nom.trim()) {
      showError('Champ requis', 'Le nom est obligatoire')
      return
    }
    if (!newUser.codeSecret || newUser.codeSecret.length !== 4) {
      showError('Code invalide', 'Le code secret doit contenir exactement 4 chiffres')
      return
    }
    if (!newUser.fraisDeblocage || parseFloat(newUser.fraisDeblocage.replace(',', '.')) < 0) {
      showError('Montant invalide', 'Les frais de déblocage sont obligatoires et ne peuvent pas être négatifs')
      return
    }
    if (!newUser.solde || parseFloat(newUser.solde.replace(',', '.')) < 0) {
      showError('Montant invalide', 'Le solde est obligatoire et ne peut pas être négatif')
      return
    }
    if (!newUser.dureeMois || newUser.dureeMois < 1) {
      showError('Durée invalide', 'La durée doit être d\'au moins 1 mois')
      return
    }

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newUser,
          fraisDeblocage: parseFloat(newUser.fraisDeblocage.replace(',', '.')),
          solde: parseFloat(newUser.solde.replace(',', '.'))
        }),
      })

      if (response.ok) {
        const user = await response.json()
        setUsers([...users, user])
        setNewUser({ nom: '', ville: '', fraisDeblocage: '', solde: '', codeSecret: '', dureeMois: 12 })
        setShowAddForm(false)
        showSuccess('Utilisateur créé', `${user.nom} a été ajouté avec succès`)
      } else {
        const error = await response.json()
        showError('Erreur', error.error || 'Impossible de créer l\'utilisateur')
      }
    } catch (error) {
      showError('Erreur', 'Impossible de se connecter au serveur')
    }
  }

  const handleRenewUser = async () => {
    if (!selectedUser) return

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`${API_URL}/api/users/${selectedUser._id}/renew`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dureeMois: renewDuration }),
      })

      if (response.ok) {
        const data = await response.json()
        const updatedUsers = users.map(user => 
          user._id === selectedUser._id ? data.user : user
        )
        setUsers(updatedUsers)
        showSuccess('Utilisateur renouvelé', `${selectedUser.nom} a été renouvelé pour ${renewDuration} mois`)
        setShowRenewModal(false)
        setSelectedUser(null)
      } else {
        const error = await response.json()
        showError('Erreur', error.error || 'Impossible de renouveler l\'utilisateur')
      }
    } catch (error) {
      showError('Erreur', 'Impossible de se connecter au serveur')
    }
  }

  const handleSuspendUser = async () => {
    if (!selectedUser) return

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`${API_URL}/api/users/${selectedUser._id}/suspend`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ suspendu: !selectedUser.suspendu }),
      })

      if (response.ok) {
        const data = await response.json()
        const updatedUsers = users.map(user => 
          user._id === selectedUser._id ? data.user : user
        )
        setUsers(updatedUsers)
        const action = selectedUser.suspendu ? 'réactivé' : 'suspendu'
        showSuccess('Utilisateur ' + action, `${selectedUser.nom} a été ${action} avec succès`)
        setShowSuspendModal(false)
        setSelectedUser(null)
      } else {
        const error = await response.json()
        showError('Erreur', error.error || 'Impossible de suspendre/réactiver l\'utilisateur')
      }
    } catch (error) {
      showError('Erreur', 'Impossible de se connecter au serveur')
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`${API_URL}/api/users/${selectedUser._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const updatedUsers = users.filter(user => user._id !== selectedUser._id)
        setUsers(updatedUsers)
        showInfo('Utilisateur supprimé', `${selectedUser.nom} a été supprimé du système`)
        setShowDeleteModal(false)
        setSelectedUser(null)
      } else {
        const error = await response.json()
        showError('Erreur', error.error || 'Impossible de supprimer l\'utilisateur')
      }
    } catch (error) {
      showError('Erreur', 'Impossible de se connecter au serveur')
    }
  }

  const openEditModal = (user: User) => {
    setSelectedUser(user)
    setEditUser({
      nom: user.nom,
      ville: user.ville || '',
      fraisDeblocage: user.fraisDeblocage.toString(),
      solde: user.solde.toString(),
      codeSecret: user.codeSecret,
      dureeMois: user.dureeMois
    })
    setShowEditModal(true)
  }

  const handleEditUser = async () => {
    if (!selectedUser) return

    // Validation des champs obligatoires
    if (!editUser.nom.trim()) {
      showError('Champ requis', 'Le nom est obligatoire')
      return
    }
    if (!editUser.codeSecret || editUser.codeSecret.length !== 4) {
      showError('Code invalide', 'Le code secret doit contenir exactement 4 chiffres')
      return
    }
    if (!editUser.fraisDeblocage || parseFloat(editUser.fraisDeblocage.replace(',', '.')) < 0) {
      showError('Montant invalide', 'Les frais de déblocage sont obligatoires et ne peuvent pas être négatifs')
      return
    }
    if (!editUser.solde || parseFloat(editUser.solde.replace(',', '.')) < 0) {
      showError('Montant invalide', 'Le solde est obligatoire et ne peut pas être négatif')
      return
    }

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`${API_URL}/api/users/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editUser,
          fraisDeblocage: parseFloat(editUser.fraisDeblocage.replace(',', '.')),
          solde: parseFloat(editUser.solde.replace(',', '.'))
        }),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        const updatedUsers = users.map(user => 
          user._id === selectedUser._id ? updatedUser : user
        )
        setUsers(updatedUsers)
        showSuccess('Utilisateur modifié', `${updatedUser.nom} a été modifié avec succès`)
        setShowEditModal(false)
        setSelectedUser(null)
      } else {
        const error = await response.json()
        showError('Erreur', error.error || 'Impossible de modifier l\'utilisateur')
      }
    } catch (error) {
      showError('Erreur', 'Impossible de se connecter au serveur')
    }
  }

  const openRenewModal = (user: User) => {
    setSelectedUser(user)
    setRenewDuration(12)
    setShowRenewModal(true)
  }

  const openDeleteModal = (user: User) => {
    setSelectedUser(user)
    setShowDeleteModal(true)
  }

  const openSuspendModal = (user: User) => {
    setSelectedUser(user)
    setShowSuspendModal(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    // Rediriger immédiatement sans notification pour éviter les boucles
    router.replace('/admin/login')
  }


  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: '📊' },
    { id: 'users', label: 'Utilisateurs', icon: '👥' }
  ]

  // Afficher un écran de chargement pendant la vérification d'authentification
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Vérification...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header moderne avec glassmorphism */}
      <div className="backdrop-blur-xl bg-white/10 border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">BNP PARIBAS</h1>
                <p className="text-blue-200 text-sm">Administration</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-white text-sm">Connecté en tant qu'admin</p>
                <p className="text-blue-200 text-xs">{new Date().toLocaleDateString('fr-FR')}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 rounded-lg border border-red-500/30 transition-all duration-200 backdrop-blur-sm"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex space-x-1 bg-white/10 backdrop-blur-sm rounded-xl p-1 border border-white/20">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white/20 text-white shadow-lg'
                  : 'text-blue-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        {/* Vue d'ensemble */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Cartes de statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-200 text-sm font-medium">Total Utilisateurs</p>
                    <p className="text-3xl font-bold text-white">{users.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500/30 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">👥</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-200 text-sm font-medium">Utilisateurs Actifs</p>
                    <p className="text-3xl font-bold text-white">{users.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/30 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">✅</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-200 text-sm font-medium">Utilisateurs Suspendus</p>
                    <p className="text-3xl font-bold text-white">0</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500/30 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">⏸️</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500/20 to-orange-600/20 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-200 text-sm font-medium">Activité</p>
                    <p className="text-3xl font-bold text-white">Active</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500/30 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">⚡</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Graphique placeholder */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6">Activité Récente</h3>
              <div className="h-64 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl flex items-center justify-center border border-white/10">
                <div className="text-center">
                  <span className="text-6xl mb-4 block">📊</span>
                  <p className="text-white/70">Graphiques d'activité à venir</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gestion des utilisateurs */}
        {activeTab === 'users' && (
          <div className="space-y-6">
        {/* Actions */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Gestion des Utilisateurs</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
                {showAddForm ? 'Annuler' : '+ Nouvel Utilisateur'}
          </button>
        </div>

            {/* Formulaire d'ajout moderne */}
        {showAddForm && (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-6">Ajouter un Utilisateur</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-blue-200">Nom complet *</label>
                <input
                  type="text"
                      required
                  value={newUser.nom}
                  onChange={(e) => setNewUser({ ...newUser, nom: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-sm"
                      placeholder="Nom de l'utilisateur (obligatoire)"
                />
              </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-blue-200">Ville</label>
                <input
                  type="text"
                  value={newUser.ville}
                  onChange={(e) => setNewUser({ ...newUser, ville: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-sm"
                      placeholder="Ville de résidence"
                />
              </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-blue-200">Code secret *</label>
                <input
                  type="text"
                      required
                  value={newUser.codeSecret}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '')
                    if (value.length <= 4) {
                      setNewUser({ ...newUser, codeSecret: value })
                    }
                  }}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-sm"
                      placeholder="Code à 4 chiffres (obligatoire)"
                  maxLength={4}
                />
              </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-blue-200">Frais de déblocage (€) *</label>
                <input
                      type="text"
                      required
                  value={newUser.fraisDeblocage}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.,]/g, '')
                        setNewUser({ ...newUser, fraisDeblocage: value })
                      }}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-sm"
                      placeholder="0.00 (obligatoire)"
                />
              </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-blue-200">Solde initial (€) *</label>
                <input
                      type="text"
                      required
                  value={newUser.solde}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.,]/g, '')
                        setNewUser({ ...newUser, solde: value })
                      }}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-sm"
                      placeholder="0.00 (obligatoire)"
                />
              </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-blue-200">Durée (mois) *</label>
                    <select
                      required
                      value={newUser.dureeMois}
                      onChange={(e) => setNewUser({ ...newUser, dureeMois: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-sm"
                    >
                      <option value={1} className="bg-slate-800">1 mois</option>
                      <option value={3} className="bg-slate-800">3 mois</option>
                      <option value={6} className="bg-slate-800">6 mois</option>
                      <option value={12} className="bg-slate-800">12 mois</option>
                      <option value={24} className="bg-slate-800">24 mois</option>
                    </select>
                  </div>
            </div>
                <div className="mt-6">
              <button
                onClick={handleAddUser}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                    Créer l'utilisateur
              </button>
            </div>
          </div>
        )}

            {/* Liste des utilisateurs moderne */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
              <div className="px-6 py-4 border-b border-white/20">
                <h3 className="text-lg font-semibold text-white">Utilisateurs ({users.length})</h3>
          </div>
          
          {users.length === 0 ? (
                <div className="p-12 text-center">
                  <span className="text-6xl mb-4 block">👥</span>
                  <p className="text-white/70 text-lg">Aucun utilisateur trouvé</p>
                  <p className="text-white/50 text-sm mt-2">Créez votre premier utilisateur</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">Nom</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">Code</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">Frais</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">Solde</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">Début</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">Fin</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                    <tbody className="divide-y divide-white/10">
                  {users.map((user) => (
                        <tr key={user._id} className="hover:bg-white/5 transition-colors duration-200">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white font-medium text-sm">{user.nom.charAt(0).toUpperCase()}</span>
                              </div>
                              <span className="text-white font-medium">{user.nom}</span>
                            </div>
                      </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-sm font-mono">
                        {user.codeSecret}
                            </span>
                      </td>
                          <td className="px-6 py-4 whitespace-nowrap text-white">
                        {user.fraisDeblocage.toFixed(2)} €
                      </td>
                          <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                        {user.solde.toFixed(2)} €
                      </td>
                          <td className="px-6 py-4 whitespace-nowrap text-white text-sm">
                            {new Date(user.dateDebut).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-white text-sm">
                            {new Date(user.dateFin).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.suspendu 
                                ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                                : 'bg-green-500/20 text-green-300 border border-green-500/30'
                            }`}>
                              {user.suspendu ? 'Suspendu' : 'Actif'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => openEditModal(user)}
                                className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 hover:text-green-200 rounded-lg border border-green-500/30 transition-all duration-200 backdrop-blur-sm text-sm"
                              >
                                Modifier
                              </button>
                              <button
                                onClick={() => openRenewModal(user)}
                                className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-blue-200 rounded-lg border border-blue-500/30 transition-all duration-200 backdrop-blur-sm text-sm"
                              >
                                Renouveler
                              </button>
                              <button
                                onClick={() => openSuspendModal(user)}
                                className={`px-3 py-1 rounded-lg border transition-all duration-200 backdrop-blur-sm text-sm ${
                                  user.suspendu 
                                    ? 'bg-green-500/20 hover:bg-green-500/30 text-green-300 hover:text-green-200 border-green-500/30'
                                    : 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 hover:text-orange-200 border-orange-500/30'
                                }`}
                              >
                                {user.suspendu ? 'Réactiver' : 'Suspendre'}
                              </button>
                        <button
                                onClick={() => openDeleteModal(user)}
                                className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 rounded-lg border border-red-500/30 transition-all duration-200 backdrop-blur-sm text-sm"
                        >
                          Supprimer
                        </button>
                            </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
        )}
      </div>

      {/* Modal d'édition */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-6">Modifier l'utilisateur</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-blue-200">Nom complet *</label>
                <input
                  type="text"
                  required
                  value={editUser.nom}
                  onChange={(e) => setEditUser({ ...editUser, nom: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-sm"
                  placeholder="Nom de l'utilisateur (obligatoire)"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-blue-200">Ville</label>
                <input
                  type="text"
                  value={editUser.ville}
                  onChange={(e) => setEditUser({ ...editUser, ville: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-sm"
                  placeholder="Ville de résidence"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-blue-200">Code secret *</label>
                <input
                  type="text"
                  required
                  value={editUser.codeSecret}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '')
                    if (value.length <= 4) {
                      setEditUser({ ...editUser, codeSecret: value })
                    }
                  }}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-sm"
                  placeholder="Code à 4 chiffres (obligatoire)"
                  maxLength={4}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-blue-200">Frais de déblocage (€) *</label>
                <input
                  type="text"
                  required
                  value={editUser.fraisDeblocage}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.,]/g, '')
                    setEditUser({ ...editUser, fraisDeblocage: value })
                  }}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-sm"
                  placeholder="0.00 (obligatoire)"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-blue-200">Solde (€) *</label>
                <input
                  type="text"
                  required
                  value={editUser.solde}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.,]/g, '')
                    setEditUser({ ...editUser, solde: value })
                  }}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-sm"
                  placeholder="0.00 (obligatoire)"
                />
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setSelectedUser(null)
                }}
                className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all duration-200"
              >
                Annuler
              </button>
              <button
                onClick={handleEditUser}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Modifier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de renouvellement */}
      {showRenewModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-6">Renouveler l'utilisateur</h3>
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-white font-medium">{selectedUser.nom}</p>
                <p className="text-white/70 text-sm">Code: {selectedUser.codeSecret}</p>
                <p className="text-white/70 text-sm">Expire le: {new Date(selectedUser.dateFin).toLocaleDateString('fr-FR')}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">Durée de renouvellement (mois)</label>
                <select
                  value={renewDuration}
                  onChange={(e) => setRenewDuration(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-sm"
                >
                  <option value={1} className="bg-slate-800">1 mois</option>
                  <option value={3} className="bg-slate-800">3 mois</option>
                  <option value={6} className="bg-slate-800">6 mois</option>
                  <option value={12} className="bg-slate-800">12 mois</option>
                  <option value={24} className="bg-slate-800">24 mois</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => {
                  setShowRenewModal(false)
                  setSelectedUser(null)
                }}
                className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all duration-200"
              >
                Annuler
              </button>
              <button
                onClick={handleRenewUser}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Renouveler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de suspension */}
      {showSuspendModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-6">
              {selectedUser.suspendu ? 'Réactiver l\'utilisateur' : 'Suspendre l\'utilisateur'}
            </h3>
            <div className="space-y-4">
              <div className={`${selectedUser.suspendu ? 'bg-green-500/10 border-green-500/30' : 'bg-orange-500/10 border-orange-500/30'} border rounded-xl p-4`}>
                <p className={`${selectedUser.suspendu ? 'text-green-300' : 'text-orange-300'} font-medium`}>
                  {selectedUser.suspendu ? '✅ Réactivation' : '⚠️ Suspension'}
                </p>
                <p className="text-white/70 text-sm mt-2">
                  {selectedUser.suspendu 
                    ? 'L\'utilisateur pourra à nouveau se connecter et utiliser ses fonctionnalités.'
                    : 'L\'utilisateur ne pourra plus se connecter jusqu\'à réactivation de son compte.'
                  }
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-white font-medium">{selectedUser.nom}</p>
                <p className="text-white/70 text-sm">Code: {selectedUser.codeSecret}</p>
                <p className="text-white/70 text-sm">Solde: {selectedUser.solde.toFixed(2)} €</p>
                <p className={`text-sm ${selectedUser.suspendu ? 'text-green-300' : 'text-orange-300'}`}>
                  Statut: {selectedUser.suspendu ? 'Suspendu' : 'Actif'}
                </p>
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => {
                  setShowSuspendModal(false)
                  setSelectedUser(null)
                }}
                className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all duration-200"
              >
                Annuler
              </button>
              <button
                onClick={handleSuspendUser}
                className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl ${
                  selectedUser.suspendu 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
                }`}
              >
                {selectedUser.suspendu ? 'Réactiver' : 'Suspendre'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de suppression */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-6">Confirmer la suppression</h3>
            <div className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <p className="text-red-300 font-medium">⚠️ Attention !</p>
                <p className="text-white/70 text-sm mt-2">Cette action est irréversible. L'utilisateur sera définitivement supprimé du système.</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-white font-medium">{selectedUser.nom}</p>
                <p className="text-white/70 text-sm">Code: {selectedUser.codeSecret}</p>
                <p className="text-white/70 text-sm">Solde: {selectedUser.solde.toFixed(2)} €</p>
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setSelectedUser(null)
                }}
                className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all duration-200"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteUser}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
