import { defineEventHandler, H3Error } from 'h3';

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    if (!body.email || !body.type) {
        const error = new H3Error('Email and link type are required.');
        error.statusCode = 400;
        return error;
    }

    // Exemple de types de liens supportés par Supabase
    const validLinkTypes = ['signup', 'magiclink', 'recovery', 'invite', 'email_change'];
    if (!validLinkTypes.includes(body.type)) {
        const error = new H3Error(`Invalid link type. Must be one of: ${validLinkTypes.join(', ')}`);
        error.statusCode = 400;
        return error;
    }

    try {
        const supabaseAdmin = getSupabaseAdminClient();
        const { data, error } = await supabaseAdmin.auth.admin.generateLink(
            {
                email: body.email,
                type: body.type,
                password: body.password, // Requis pour 'signup' et 'email_change' si l'email change
            }
        );

        if (error) {
            console.error('Supabase Admin Error (generateLink):', error.message);
            const h3Error = new H3Error(`Failed to generate link: ${error.message}`);
            h3Error.statusCode = error.status || 500;
            return h3Error;
        }

        return { properties: data.properties, user: data.user }; // data.properties contient le lien généré

    } catch (e: any) {
        console.error('Server API Error (generateLink):', e.message);
        const error = new H3Error(`Internal server error: ${e.message}`);
        error.statusCode = 500;
        return error;
    }
});