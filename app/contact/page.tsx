'use client'

import { ChevronLeft, ChevronRight, Phone, Mail, Calendar, Bell, LogOut } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function ContactPage() {
  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-gray-600">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">Contact</h1>
          <div className="flex items-center gap-3">
           
          </div>
        </div>

        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <div className="text-teal-600 text-sm">ℹ️</div>
          <div>
            <p className="text-sm font-medium text-teal-900">Service Proximité</p>
          </div>
        </div>

        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Conseillers de mon agence
          </h2>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-semibold text-gray-900">BNP Paribas</p>
                <p className="text-xs text-gray-600">20 bd Vaugirard, Paris</p>
              </div>
              <button className="text-teal-600 text-sm">ℹ️</button>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="bg-teal-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                Ouvert
              </span>
              <span className="text-xs text-gray-600">Fermé à 18h00</span>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-teal-600" />
                <span className="text-sm font-medium text-gray-900">Appeler</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-teal-600" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Échanger par message</p>
                  <p className="text-xs text-gray-500">
                    Obtenez une réponse dans un délai moyen de 72h ouvrées.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button className="w-full flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-teal-600" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">Prendre un rendez-vous</p>
                  <div className="mt-1">
                    <span className="bg-yellow-400 text-gray-900 text-xs font-medium px-2 py-1 rounded">
                      2 rendez-vous prévus
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Assistance immédiate
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            La plupart des problèmes rencontrés peuvent être résolus en quelques minutes
          </p>

          <div className="grid grid-cols-2 gap-4">
            <Link href="/" className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl">😊</span>
              </div>
              <span className="text-xs font-medium text-gray-900">Accueil</span>
            </Link>

            <Link href="/paiements" className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl">🔗</span>
              </div>
              <span className="text-xs font-medium text-gray-900">Paiements</span>
            </Link>

            <Link href="/decouvrir" className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl">🔍</span>
              </div>
              <span className="text-xs font-medium text-gray-900">Découvrir</span>
            </Link>

            <Link href="/contact" className="flex flex-col items-center gap-2 p-4 bg-teal-500 rounded-lg hover:bg-teal-600 transition-colors">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
              <span className="text-xs font-medium text-white">Contact</span>
            </Link>

            <Link href="/profil" className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              <span className="text-xs font-medium text-gray-900">Vous</span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
