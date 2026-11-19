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

<!-- checkpoint-2: docs(workflow): document student course registration lifecycle and priority rules -->

<!-- checkpoint-3: perf(bundle): configure bundle analyzer settings and production chunk splitting -->

<!-- checkpoint-4: ci(lint): add strict eslint and typescript validation rules for pre-commit checks -->

<!-- checkpoint-5: security(headers): introduce content security policy and secure http response headers -->

<!-- checkpoint-6: chore(deps): audit npm production dependencies and lockfile consistency -->

<!-- checkpoint-7: refactor(types): strengthen academic record and enrollment data models -->

<!-- checkpoint-8: feat(accessibility): improve aria labels and keyboard focus traps across dialogs -->

<!-- checkpoint-9: test(units): introduce test harness setup and mock data structures for catalog -->

<!-- checkpoint-10: feat(offline): configure progressive service worker caching strategies for assets -->

<!-- checkpoint-11: refactor(utils): centralize date formatting and academic term time helper functions -->

<!-- checkpoint-12: style(tokens): formalize university typography scales and elevation shadow tokens -->
