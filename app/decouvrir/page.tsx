'use client'

import { ChevronRight, Play, X, LogOut } from 'lucide-react'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default function DiscoverPage() {
  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Découvrir</h1>
        </div>
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Avis d&apos;experts</h2>
            <button className="text-teal-600 text-sm font-medium flex items-center gap-1">
              Tout voir
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <Card className="overflow-hidden">
            <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-300">
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <img
                  src="https://images.pexels.com/photos/7821513/pexels-photo-7821513.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Expert immobilier"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-4 left-4 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded">
                Immobilier
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                L&apos;épargne logement, préparez votre achat immobilier
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Play className="w-3 h-3" />
                <span>10 min</span>
                <span>•</span>
                <span>28 mai 2024</span>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Offre à la une</h2>

          <Card className="p-5 bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200 relative overflow-hidden">
            <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl p-4 flex-shrink-0 w-16 h-16 flex items-center justify-center">
                <span className="text-3xl">🌍</span>
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-900 mb-2">
                  Réduire ses émissions de CO2
                </h3>
                <p className="text-xs text-gray-600 mb-4">
                  Découvrez nos solutions pour contribuer à la transition écologique
                </p>
                <button className="bg-teal-600 text-white text-xs font-medium px-4 py-2 rounded-full hover:bg-teal-700 transition-colors">
                  En savoir plus
                </button>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Catégories</h2>

          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: '🏠', label: 'Immobilier', color: 'bg-blue-50' },
              { icon: '💰', label: 'Épargne', color: 'bg-green-50' },
              { icon: '📊', label: 'Investir', color: 'bg-purple-50' },
              { icon: '🔒', label: 'Assurance', color: 'bg-orange-50' },
              { icon: '💳', label: 'Crédit', color: 'bg-pink-50' },
              { icon: '🌱', label: 'Écologie', color: 'bg-teal-50' }
            ].map((category, index) => (
              <button
                key={index}
                className={`${category.color} rounded-xl p-4 flex flex-col items-center gap-2 hover:opacity-80 transition-opacity`}
              >
                <span className="text-3xl">{category.icon}</span>
                <span className="text-xs font-medium text-gray-900">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recommandé pour vous
          </h2>

          <div className="space-y-4">
            <Card className="p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📱</span>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Personnalisez votre application
                </h3>
                <p className="text-xs text-gray-600">
                  Créez des raccourcis vers vos fonctionnalités préférées
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Card>

            <Card className="p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">⭐</span>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Programme fidélité
                </h3>
                <p className="text-xs text-gray-600">
                  Découvrez vos avantages et récompenses
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
