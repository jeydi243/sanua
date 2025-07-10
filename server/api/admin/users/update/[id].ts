import { defineEventHandler, H3Error } from 'h3';

export default defineEventHandler(async (event) => {
    const userId = getRouterParams(event).id;
    const body = await readBody(event);

    if (!userId) {
        const error = new H3Error('User ID is required.');
        error.statusCode = 400;
        return error;
    }

    if (Object.keys(body).length === 0) {
        const error = new H3Error('Request body cannot be empty for update.');
        error.statusCode = 400;
        return error;
    }

    try {
        const supabaseAdmin = getSupabaseAdminClient();
        const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, body);

        if (error) {
            console.error('Supabase Admin Error (updateUserById):', error.message);
            const h3Error = new H3Error(`Failed to update user: ${error.message}`);
            h3Error.statusCode = error.status || 500;
            return h3Error;
        }

        return { user: data.user };

    } catch (e: any) {
        console.error('Server API Error (updateUserById):', e.message);
        const error = new H3Error(`Internal server error: ${e.message}`);
        error.statusCode = 500;
        return error;
    }
});