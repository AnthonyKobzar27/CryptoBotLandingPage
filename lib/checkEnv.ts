export function checkEnvironmentVariables() {
  const required = {
    'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_API,
    'NEXT_PUBLIC_CRYPTOBOT_WALLET_ADDRESS': process.env.NEXT_PUBLIC_CRYPTOBOT_WALLET_ADDRESS,
    'CRYPTOBOT_PRIVATE_KEY': process.env.CRYPTOBOT_PRIVATE_KEY,
  }

  const missing: string[] = []
  
  Object.entries(required).forEach(([key, value]) => {
    if (!value) {
      missing.push(key)
    }
  })

  if (missing.length > 0) {
    console.warn('⚠️  Missing environment variables:', missing.join(', '))
    console.warn('📝 Create a .env.local file in the robotdapp folder')
    console.warn('📄 See .env.local.example for template')
    return false
  }

  console.log('✅ All environment variables loaded')
  return true
}

export function getEnvStatus() {
  return {
    supabase: !!(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL),
    cryptobot: !!process.env.NEXT_PUBLIC_CRYPTOBOT_WALLET_ADDRESS,
    privateKey: !!process.env.CRYPTOBOT_PRIVATE_KEY,
  }
}

