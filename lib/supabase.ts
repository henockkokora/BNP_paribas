import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      accounts: {
        Row: {
          id: string
          user_id: string
          account_number: string
          account_type: string
          balance: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          account_number: string
          account_type: string
          balance?: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          account_number?: string
          account_type?: string
          balance?: number
          created_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          account_id: string
          amount: number
          type: 'income' | 'expense'
          category: string
          description: string
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          account_id: string
          amount: number
          type: 'income' | 'expense'
          category: string
          description: string
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          account_id?: string
          amount?: number
          type?: 'income' | 'expense'
          category?: string
          description?: string
          date?: string
          created_at?: string
        }
      }
      budgets: {
        Row: {
          id: string
          account_id: string
          category: string
          amount: number
          period: string
          created_at: string
        }
        Insert: {
          id?: string
          account_id: string
          category: string
          amount: number
          period: string
          created_at?: string
        }
        Update: {
          id?: string
          account_id?: string
          category?: string
          amount?: number
          period?: string
          created_at?: string
        }
      }
      cards: {
        Row: {
          id: string
          account_id: string
          card_number: string
          card_type: string
          card_name: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          account_id: string
          card_number: string
          card_type: string
          card_name: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          account_id?: string
          card_number?: string
          card_type?: string
          card_name?: string
          status?: string
          created_at?: string
        }
      }
    }
  }
}
