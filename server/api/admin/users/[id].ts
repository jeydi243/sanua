import { defineEventHandler, getRouterParams, H3Error } from 'h3';
// Importation du helper pour le client admin
// import { getSupabaseAdminClient } from '../../utils/supabaseAdmin';

export default defineEventHandler(async (event) => {
    const userId = getRouterParams(event).id;

    if (!userId) {
        const error = new H3Error('User ID is required');
        error.statusCode = 400;
        return error;
    }

    try {
        const supabaseAdmin = getSupabaseAdminClient();
        const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);

        if (error) {
            console.error('Supabase Admin Error (getUserById):', error.message);
            const h3Error = new H3Error(`Failed to fetch user: ${error.message}`);
            h3Error.statusCode = error.status || 500;
            return h3Error;
        }

        return { user: data.user };

    } catch (e: any) {
        console.error('Server API Error (getUserById):', e.message);
        const error = new H3Error(`Internal server error: ${e.message}`);
        error.statusCode = 500;
        return error;
    }
});