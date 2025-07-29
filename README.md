# Sanua Microfinance

Sanua is a web application for microfinance management, built with Nuxt.js and Supabase.

## Tech Stack

- **Framework**: [Nuxt.js](https://nuxt.com/)
- **UI Framework**: [Vue.js](https://vuejs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [Shadcn-Vue](https://www.shadcn-vue.com/)
- **Backend & Auth**: [Supabase](https://supabase.io/)
- **State Management**: [Pinia](https://pinia.vuejs.org/)
- **Form Validation**: [VeeValidate](https://vee-validate.logaretm.com/) & [Zod](https://zod.dev/)
- **Package Manager**: [Bun](https://bun.sh/)

## Prerequisites

Before you begin, ensure you have [Bun](https://bun.sh/docs/installation) installed on your system.

## Project Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd sanua
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project by copying the example file:
    ```bash
    cp .env.example .env
    ```
    You will need to add your Supabase project URL and anon key to the `.env` file. These are required for the application to connect to your Supabase backend.

    ```env
    SUPABASE_URL="your-supabase-project-url"
    SUPABASE_KEY="your-supabase-anon-key"
    ```

## Development

To start the development server, run the following command. The application will be available at `http://localhost:3000`.

```bash
bun run dev
```

## Production

To build the application for production, use:

```bash
bun run build
```

To preview the production build locally, run:

```bash
bun run preview
```

## Folder Structure

A brief overview of the key directories in this project:

-   `.`
-   `├── /assets` - Contains un-compiled assets such as CSS or images.
-   `├── /components` - Contains Vue components.
-   `├── /composables` - Contains reusable composable functions.
-   `├── /layouts` - Defines the layout of your application, which can be applied to different pages.
-   `├── /pages` - Contains your application's views and routes. Nuxt reads all the `.vue` files inside this directory and creates the application router.
-   `├── /plugins` - Contains plugins to be registered globally.
-   `├── /server` - Contains server-side logic, including API endpoints.
-   `├── /static` - Contains static files that are directly served at the root.
-   `├── /stores` - Contains Pinia store modules for state management.
-   `├── /types` - Contains TypeScript type definitions.
-   `└── nuxt.config.ts` - The main configuration file for Nuxt.

---
*This README was improved by the Gemini CLI.*