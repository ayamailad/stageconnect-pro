import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface RejectApplicationRequest {
  applicationId: string;
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    const { applicationId }: RejectApplicationRequest = await req.json();

    // 1. Get application details
    const { data: application, error: appError } = await supabaseAdmin
      .from("applications")
      .select("candidate_name, candidate_email, cv_file_path, cover_letter_path, internship_agreement_path")
      .eq("id", applicationId)
      .single();

    if (appError) throw new Error(`Failed to fetch application: ${appError.message}`);
    if (!application) throw new Error("Application not found");

    // 2. Delete files from storage if they exist
    const filesToDelete: string[] = [];
    if (application.cv_file_path) filesToDelete.push(application.cv_file_path);
    if (application.cover_letter_path) filesToDelete.push(application.cover_letter_path);
    if (application.internship_agreement_path) filesToDelete.push(application.internship_agreement_path);

    if (filesToDelete.length > 0) {
      const { error: storageError } = await supabaseAdmin.storage
        .from("applications")
        .remove(filesToDelete);

      if (storageError) {
        console.error("Error deleting files:", storageError);
        // Continue even if file deletion fails
      }
    }

    // 3. Get user profile to find user_id
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("user_id")
      .eq("email", application.candidate_email)
      .maybeSingle();

    // 4. Delete application first
    const { error: deleteAppError } = await supabaseAdmin
      .from("applications")
      .delete()
      .eq("id", applicationId);

    if (deleteAppError) throw new Error(`Failed to delete application: ${deleteAppError.message}`);

    // 5. Delete user auth and profile (if exists)
    if (profile?.user_id) {
      // Delete from auth.users (this will cascade to profiles)
      const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(
        profile.user_id
      );

      if (authDeleteError) {
        console.error("Error deleting user auth:", authDeleteError);
        // Continue even if auth deletion fails
      }
    }

    // 6. Send rejection email if Resend is configured
    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      
      try {
        await resend.emails.send({
          from: "Gestion des stages <onboarding@resend.dev>",
          to: [application.candidate_email],
          subject: "Mise à jour de votre candidature",
          html: `
            <h1>Bonjour ${application.candidate_name},</h1>
            <p>Nous vous remercions de l'intérêt que vous avez porté à notre programme de stage.</p>
            <p>Après examen attentif de votre candidature, nous avons le regret de vous informer que nous ne pouvons pas donner suite à votre demande pour le moment.</p>
            <p>Nous vous souhaitons beaucoup de succès dans vos recherches et votre parcours professionnel.</p>
            <p>Cordialement,<br>L'équipe de gestion des stages</p>
          `,
        });
      } catch (emailError) {
        console.error("Error sending rejection email:", emailError);
        // Don't throw error, email is optional
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "Application rejected successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in reject-application function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
