import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Database helper types
export type Transaction = {
  id: string
  reference_number: string
  property_id: string | null
  transaction_type: 'sale' | 'purchase' | 'remortgage' | 'transfer_of_equity'
  status: string
  price: number | null
  completion_date: string | null
  exchange_date: string | null
  target_completion_date: string | null
  chain_position: number
  is_chain: boolean
  notes: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export type Milestone = {
  id: string
  transaction_id: string
  title: string
  description: string | null
  category: string
  status: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'skipped'
  due_date: string | null
  completed_at: string | null
  sort_order: number
  is_required: boolean
  created_at: string
}

export type Payment = {
  id: string
  transaction_id: string
  stripe_payment_intent_id: string | null
  payment_type: string
  amount: number
  platform_fee_amount: number
  conveyancer_amount: number
  status: string
  paid_at: string | null
  created_at: string
}

export type KycVerification = {
  id: string
  user_id: string
  provider: string
  verification_type: string
  status: string
  result: string | null
  risk_level: string | null
  identity_verified: boolean
  address_verified: boolean
  created_at: string
}
