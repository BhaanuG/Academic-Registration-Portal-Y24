# Academic Registration Portal

Clean JavaScript-first implementation of the KLEF Academic Registration Portal built with Next.js App Router and Payload CMS.

## Architecture

- `src/app/`: Next.js App Router route handlers and pages.
- `src/features/`: Feature modules for admin, student, and teacher workflows.
- `src/components/`: Reusable UI components organized by purpose (common, forms, dialogs, navigation).
- `src/services/`: Client and server API, authentication, and database interfaces.
- `src/hooks/`: React lifecycle hooks.
- `src/context/`: Context providers for authentication and application state.
- `src/styles/`: Global stylesheets and design tokens.
- `server/`: Server-side controllers and database helpers.
- `public/`: Static assets, images, and brand icons.

## Running the Application

```bash
pnpm install
pnpm dev
```

<!-- checkpoint-1: docs(readme): expand portal architecture and high-level system overview -->
