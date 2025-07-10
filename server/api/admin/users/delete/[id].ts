import { defineEventHandler, H3Error } from 'h3';

export default defineEventHandler(async (event) => {
    const userId = getRouterParams(event).id;

    if (!userId) {
        const error = new H3Error('User ID is required.');
        error.statusCode = 400;
        return error;
    }

    try {
        const supabaseAdmin = getSupabaseAdminClient();
        // Le deuxième argument est un objet d'options, par exemple pour forcer la suppression
        const { data, error } = await supabaseAdmin.auth.admin.deleteUser(userId);

        if (error) {
            console.error('Supabase Admin Error (deleteUser):', error.message);
            const h3Error = new H3Error(`Failed to delete user: ${error.message}`);
            h3Error.statusCode = error.status || 500;
            return h3Error;
        }

        // Supabase retourne null pour data.user si l'utilisateur est supprimé avec succès
        // et data.user contient l'utilisateur supprimé si l'option 'x-force-delete' est utilisée.
        return { message: 'User deleted successfully', user: data.user };

    } catch (e: any) {
        console.error('Server API Error (deleteUser):', e.message);
        const error = new H3Error(`Internal server error: ${e.message}`);
        error.statusCode = 500;
        return error;
    }
});