import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_API || ''

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export interface LedgerEntry {
  transaction_id: number
  sender_id: number
  reciever_id: number | null
  type: string | null
  sending: boolean | null
  date: string | null
  transaction_hash?: string | null
  from_address?: string | null
  to_address?: string | null
}

