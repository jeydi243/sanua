import { defineEventHandler, H3Error } from 'h3';

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const page = parseInt(query.page as string || '1');
    const perPage = parseInt(query.perPage as string || '1000'); // Supabase a une limite par défaut de 1000

    try {
        const supabaseAdmin = getSupabaseAdminClient();
        // Supabase listUsers ne supporte pas directement la pagination par offset/limit
        // Il faut utiliser des filtres si besoin ou récupérer tous les utilisateurs et paginer côté serveur Nuxt
        const { data, error } = await supabaseAdmin.auth.admin.listUsers();

        if (error) {
            console.error('Supabase Admin Error (listUsers):', error.message);
            const h3Error = new H3Error(`Failed to list users: ${error.message}`);
            h3Error.statusCode = error.status || 500;
            return h3Error;
        }

        // Implémentation simple de pagination côté serveur Nuxt si nécessaire
        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
        const paginatedUsers = data.users.slice(startIndex, endIndex);

        return {
            users: paginatedUsers,
            total: data.users.length,
            page: page,
            perPage: perPage,
            totalPages: Math.ceil(data.users.length / perPage)
        };

    } catch (e: any) {
        console.error('Server API Error (listUsers):', e.message);
        const error = new H3Error(`Internal server error: ${e.message}`);
        error.statusCode = 500;
        return error;
    }
});