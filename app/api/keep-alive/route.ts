// app/api/keep-alive/route.ts
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  // Initialisation du client Supabase en utilisant les variables d'environnement

    const supabaseUrl = process.env.SUPABASE_URL!
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // ou ANON_KEY si tu préfères
    const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // Exécution de la requête keep-alive (SELECT 1)
    const { error } = await supabase.rpc('heartbeat_rpc') // Méthode recommandée
    // OU, si vous préférez interroger une table:
    // const { error } = await supabase.from('your_table_name').select('count', { count: 'exact', head: true })

    if (error) {
      console.error("Erreur lors de l'exécution de la requête keep-alive:", error)
      return NextResponse.json({ message: 'Erreur lors du keep-alive' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Keep-alive exécuté avec succès' }, { status: 200 })
  } catch (error) {
    console.error("Erreur interne:", error)
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 })
  }
}