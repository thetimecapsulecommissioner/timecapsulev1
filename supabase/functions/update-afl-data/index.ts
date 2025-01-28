import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// Initialize Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function fetchAFLData() {
  try {
    // Example using the official AFL API (you'll need to replace with actual API endpoint)
    const playersResponse = await fetch('https://api.afl.com.au/cfs/afl/players')
    const coachesResponse = await fetch('https://api.afl.com.au/cfs/afl/coaches')
    
    const players = await playersResponse.json()
    const coaches = await coachesResponse.json()
    
    return { players, coaches }
  } catch (error) {
    console.error('Error fetching AFL data:', error)
    throw error
  }
}

Deno.serve(async (req) => {
  try {
    // Check for secret token
    const authHeader = req.headers.get('Authorization')
    if (authHeader !== `Bearer ${Deno.env.get('AFL_API_SECRET')}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { players, coaches } = await fetchAFLData()

    // Update players table
    if (players?.length > 0) {
      const { error: deletePlayersError } = await supabase
        .from('afl_players')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all existing records

      if (deletePlayersError) throw deletePlayersError

      const { error: insertPlayersError } = await supabase
        .from('afl_players')
        .insert(players.map((player: any) => ({
          name: player.name,
          team: player.team,
          position: player.position
        })))

      if (insertPlayersError) throw insertPlayersError
    }

    // Update coaches table
    if (coaches?.length > 0) {
      const { error: deleteCoachesError } = await supabase
        .from('afl_coaches')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all existing records

      if (deleteCoachesError) throw deleteCoachesError

      const { error: insertCoachesError } = await supabase
        .from('afl_coaches')
        .insert(coaches.map((coach: any) => ({
          name: coach.name,
          team: coach.team,
          role: coach.role
        })))

      if (insertCoachesError) throw insertCoachesError
    }

    return new Response(
      JSON.stringify({ message: 'AFL data updated successfully' }),
      { headers: { 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }
})