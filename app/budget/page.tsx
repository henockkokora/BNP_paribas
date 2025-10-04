'use client'

import { ChevronLeft, Info } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { DonutChart } from '@/components/charts/donut-chart'
import Link from 'next/link'

export default function BudgetPage() {
  const expenseData = [
    { label: 'Logement', value: 672.50, color: '#EF4444', percentage: 50 },
    { label: 'Loisirs et sorties', value: 336.25, color: '#EC4899', percentage: 25 },
    { label: 'Enfants', value: 201.75, color: '#F59E0B', percentage: 15 }
  ]

  const incomeData = [
    { label: 'Salaires et revenus d\'activité', value: 1440, color: '#14B8A6', percentage: 80 },
    { label: 'Autres', value: 360, color: '#06B6D4', percentage: 20 }
  ]

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      <div className="bg-teal-500 text-white p-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-white">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-bold">Compte de chèques</h1>
          <div className="w-6"></div>
        </div>

        <p className="text-teal-100 text-sm mb-1">N° **** 1249</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-teal-100 mb-1">Mes opérations</p>
            <button className="bg-teal-600 text-white text-sm font-medium px-4 py-2 rounded-full">
              Mon budget
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 -mt-8">
        <Card className="p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              Dépenses
              <button className="text-teal-600">
                <Info className="w-4 h-4" />
              </button>
            </h2>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-1">Mai 2024</p>
            <p className="text-3xl font-bold text-gray-900">- 1 345,00 €</p>
          </div>

          <div className="bg-teal-50 rounded-lg p-4 mb-6">
            <DonutChart data={expenseData} />
          </div>

          <div className="space-y-3">
            {expenseData.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-900">{item.label}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">- {item.value.toFixed(2)} €</p>
                  <p className="text-xs text-gray-500">{item.percentage} %</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">le mois dernier</span>
              <span className="text-sm font-medium text-gray-900">- 1 282,36 €</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              Recettes
              <button className="text-teal-600">
                <Info className="w-4 h-4" />
              </button>
            </h2>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-1">Mai 2024</p>
            <p className="text-3xl font-bold text-teal-600">+ 1 800,00 €</p>
          </div>

          <div className="bg-teal-50 rounded-lg p-4 mb-6">
            <DonutChart data={incomeData} />
          </div>

          <div className="space-y-3">
            {incomeData.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-900">{item.label}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-teal-600">+ {item.value.toFixed(2)} €</p>
                  <p className="text-xs text-gray-500">{item.percentage} %</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">le mois dernier</span>
              <span className="text-sm font-medium text-teal-600">+ 1 740,00 €</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
