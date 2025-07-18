import { defineEventHandler, H3Error } from 'h3';

export const createUserSchema = {
    type: 'object',
    properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 6 },
        phone: { type: 'string', nullable: true },
        email_confirm: { type: 'boolean', nullable: true },
        user_metadata: { type: 'object', nullable: true }
    },
    required: ['email', 'password'],
    additionalProperties: false
};

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    // Simple validation (vous pouvez utiliser un package de validation plus robuste comme Zod ou Yup)
    if (!body.email || !body.password) {
        const error = new H3Error('Email and password are required.');
        error.statusCode = 400;
        return error;
    }

    if (!body.user_type) {
        const error = new H3Error("Vous devez definir le type d''utilisateur. (Public ou Interne)");
        error.statusCode = 400;
        return error;
    }

    try {
        const supabaseAdmin = getSupabaseAdminClient();
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email: body.email,
            password: body.password,
            email_confirm: body.email_confirm,
            user_metadata: body.user_metadata
        });

        if (error) {
            console.error('Supabase Admin Error (createUser):', error.message);
            const h3Error = new H3Error(`Failed to create user: ${error.message}`);
            h3Error.statusCode = error.status || 500;
            return h3Error;
        }

        return { user: data.user };

    } catch (e: any) {
        console.error('Server API Error (createUser):', e.message);
        const error = new H3Error(`Internal server error: ${e.message}`);
        error.statusCode = 500;
        return error;
    }
});