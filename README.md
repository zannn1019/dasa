# Dasa (Aprilando Sentosa) Monorepo

Welcome to the **Dasa** project repository. This is a Monorepo containing both the Frontend (Nuxt) and the CMS (Strapi 5), orchestrated with Docker Compose for a seamless development experience.

## Project Structure

- **[dasa-frontend/](file:///home/zan/Projects/Dasa/dasa-frontend)**: A modern Nuxt web application.
- **[dasa-cms/](file:///home/zan/Projects/Dasa/dasa-cms)**: A Strapi 5 headless CMS backed by PostgreSQL.
- **[scripts/](file:///home/zan/Projects/Dasa/scripts)**: Automation and seeding scripts.

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose installed on your machine.

### Running the Project

To build and start all services (Frontend, CMS, and Database), run:

```bash
docker compose up --build
```

### Accessing the Services

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Strapi CMS:** [http://localhost:1337](http://localhost:1337)
- **Strapi Admin Panel:** [http://localhost:1337/admin](http://localhost:1337/admin)

## Data Migration & Seeding

### Importing Data from Export
If you have a Strapi export file (e.g., `migration.tar.gz.tar.gz`), you can import it using:

```bash
docker exec -it dasa-cms npx strapi import --file .tmp/migration.tar.gz.tar.gz
```

### Seeding Initial Services
To seed the database with initial service data:

```bash
node scripts/seed-services.mjs <admin-email> <admin-password>
```

## Development

- **Node Version:** 24 (Alpine-based)
- **Styling:** CSS / Tailwind
- **Frameworks:** Nuxt 4, Strapi 5

## Licenses & Ownership

© 2026 Aprilando Sentosa. All rights reserved.
