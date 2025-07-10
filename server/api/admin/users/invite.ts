import { defineEventHandler, H3Error } from 'h3';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    if (!body.email) {
        const error = new H3Error('Email is required for invitation.');
        error.statusCode = 400;
        return error;
    }

    try {
        const supabaseAdmin = getSupabaseAdminClient();
        const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(
            body.email,
            {
                data: body.user_metadata // Optionnel: metadata utilisateur
            }
        );

        if (error) {
            console.error('Supabase Admin Error (inviteUserByEmail):', error.message);
            const h3Error = new H3Error(`Failed to invite user: ${error.message}`);
            h3Error.statusCode = error.status || 500;
            return h3Error;
        }

        return { user: data.user };

    } catch (e: any) {
        console.error('Server API Error (inviteUserByEmail):', e.message);
        const error = new H3Error(`Internal server error: ${e.message}`);
        error.statusCode = 500;
        return error;
    }
});