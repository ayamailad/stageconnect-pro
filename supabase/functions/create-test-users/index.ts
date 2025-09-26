import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const testUsers = [
      // Admin users
      { email: 'admin1@test.com', role: 'admin', firstName: 'Admin', lastName: 'One' },
      { email: 'admin2@test.com', role: 'admin', firstName: 'Admin', lastName: 'Two' },
      { email: 'admin3@test.com', role: 'admin', firstName: 'Admin', lastName: 'Three' },
      
      // Supervisor users
      { email: 'supervisor1@test.com', role: 'supervisor', firstName: 'Supervisor', lastName: 'One' },
      { email: 'supervisor2@test.com', role: 'supervisor', firstName: 'Supervisor', lastName: 'Two' },
      { email: 'supervisor3@test.com', role: 'supervisor', firstName: 'Supervisor', lastName: 'Three' },
      { email: 'supervisor4@test.com', role: 'supervisor', firstName: 'Supervisor', lastName: 'Four' },
      { email: 'supervisor5@test.com', role: 'supervisor', firstName: 'Supervisor', lastName: 'Five' },
      
      // Intern users
      { email: 'intern1@test.com', role: 'intern', firstName: 'Intern', lastName: 'One' },
      { email: 'intern2@test.com', role: 'intern', firstName: 'Intern', lastName: 'Two' },
      { email: 'intern3@test.com', role: 'intern', firstName: 'Intern', lastName: 'Three' },
      { email: 'intern4@test.com', role: 'intern', firstName: 'Intern', lastName: 'Four' },
      { email: 'intern5@test.com', role: 'intern', firstName: 'Intern', lastName: 'Five' },
      { email: 'intern6@test.com', role: 'intern', firstName: 'Intern', lastName: 'Six' },
      { email: 'intern7@test.com', role: 'intern', firstName: 'Intern', lastName: 'Seven' },
      { email: 'intern8@test.com', role: 'intern', firstName: 'Intern', lastName: 'Eight' },
      
      // Candidate users
      { email: 'candidate1@test.com', role: 'candidate', firstName: 'Candidate', lastName: 'One' },
      { email: 'candidate2@test.com', role: 'candidate', firstName: 'Candidate', lastName: 'Two' },
      { email: 'candidate3@test.com', role: 'candidate', firstName: 'Candidate', lastName: 'Three' },
      { email: 'candidate4@test.com', role: 'candidate', firstName: 'Candidate', lastName: 'Four' },
    ]

    const results = []
    
    for (const user of testUsers) {
      try {
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email: user.email,
          password: 'password123',
          email_confirm: true,
          user_metadata: {
            first_name: user.firstName,
            last_name: user.lastName,
            role: user.role
          }
        })

        if (error) {
          console.error(`Error creating user ${user.email}:`, error)
          results.push({ email: user.email, success: false, error: error.message })
        } else {
          console.log(`Successfully created user: ${user.email}`)
          results.push({ email: user.email, success: true, userId: data.user?.id })
        }
      } catch (err) {
        console.error(`Exception creating user ${user.email}:`, err)
        results.push({ email: user.email, success: false, error: String(err) })
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Test users creation completed',
        results,
        summary: {
          total: testUsers.length,
          successful: results.filter(r => r.success).length,
          failed: results.filter(r => !r.success).length
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: String(error) }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})