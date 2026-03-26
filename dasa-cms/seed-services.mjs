#!/usr/bin/env node
/**
 * Seed script — populates all 4 Service entries in Strapi.
 * Usage: node seed-services.mjs <admin-email> <admin-password>
 */

const BASE = 'http://localhost:1337';
const [,, email, password] = process.argv;

if (!email || !password) {
  console.error('Usage: node seed-services.mjs <admin-email> <admin-password>');
  process.exit(1);
}

const services = [
  {
    title: 'Dev Ops',
    description: 'Streamline your development lifecycle with automated CI/CD pipelines, containerization, and robust cloud infrastructure management.',
    overview: 'DASA DevOps services bridge the gap between development and operations, allowing your teams to deliver software faster and more reliably. We implement best-in-class automation, monitoring, and infrastructure-as-code solutions tailored to your environment.',
    slug: 'devops',
    order: 1,
    subServices: [
      { title: 'CI/CD Pipelines',        description: 'Automate your build, test, and deployment processes to reduce manual effort and accelerate release cycles.' },
      { title: 'Containerization',       description: 'Package and deploy your applications using Docker and Kubernetes for consistent, scalable environments.' },
      { title: 'Infrastructure as Code', description: 'Manage cloud infrastructure programmatically using Terraform and Ansible for repeatability and version control.' },
      { title: 'Monitoring & Alerting',  description: 'Gain full visibility into your systems with real-time monitoring, dashboards, and proactive alerting.' },
    ],
    technologies: ['Docker','Kubernetes','Terraform','Jenkins','Ansible','Prometheus'],
  },
  {
    title: 'Data Integration',
    description: 'Connect and synchronize disparate data sources into a unified, reliable stream of information for your business processes.',
    overview: 'Our Data Integration services unify your scattered data landscape into a coherent, reliable pipeline. We help you eliminate data silos, improve data quality, and ensure your business processes have access to accurate, timely information.',
    slug: 'data-integration',
    order: 2,
    subServices: [
      { title: 'ETL / ELT Pipelines',    description: 'Design and build robust extract, transform, and load pipelines that move data reliably between systems.' },
      { title: 'API Integration',         description: 'Connect disparate applications and services through secure, well-documented API integrations.' },
      { title: 'Data Quality Management', description: 'Implement validation rules and cleansing routines to ensure only high-quality data reaches your downstream systems.' },
      { title: 'Real-Time Streaming',     description: 'Enable event-driven architectures and real-time data processing with Apache Kafka and similar technologies.' },
    ],
    technologies: ['Apache Kafka','Apache Spark','Talend','MuleSoft','Informatica','dbt'],
  },
  {
    title: 'Database Platform',
    description: 'Design and optimize high-performance database systems that ensure data integrity, security, and high availability.',
    overview: "DASA's Database Platform services cover the full lifecycle of enterprise database management — from initial design and migration to ongoing performance tuning and high-availability configuration. We work with Oracle, PostgreSQL, MySQL, and other leading platforms.",
    slug: 'database-platform',
    order: 3,
    subServices: [
      { title: 'Implementation',     description: 'Install, configure, and orchestrate database migrations and deployments to production with zero-downtime strategies.' },
      { title: 'Maintenance',        description: 'Preventive maintenance, patching, and configuration management to keep your databases healthy and performant.' },
      { title: 'Monitoring',         description: 'Continuous monitoring of database health, performance metrics, and automatic alerting on anomalies or errors.' },
      { title: 'Performance Tuning', description: 'Query optimization, index management, and resource planning to ensure your databases run at peak efficiency.' },
    ],
    technologies: ['Oracle','PostgreSQL','MySQL','Oracle Enterprise Manager','SolarWinds','Dynatrace'],
  },
  {
    title: 'Development',
    description: 'Build scalable, robust applications using modern frameworks and industry best practices tailored to your specific requirements.',
    overview: 'Our Development team delivers end-to-end software solutions — from requirements analysis and architecture design through to delivery and post-launch support. We build web platforms, internal tools, and integrations using modern, battle-tested technologies.',
    slug: 'development',
    order: 4,
    subServices: [
      { title: 'Web Application',    description: 'Build modern, responsive web applications using frameworks like Vue, React, and Next.js backed by robust APIs.' },
      { title: 'Backend & API',      description: 'Design scalable RESTful and GraphQL APIs with proper authentication, rate limiting, and documentation.' },
      { title: 'System Integration', description: 'Connect legacy systems with modern platforms through custom middleware, adapters, and integration layers.' },
      { title: 'Quality Assurance',  description: 'Automated testing suites, code reviews, and continuous quality checks ensure software reliability and maintainability.' },
    ],
    technologies: ['Vue.js','React','Node.js','Laravel','Python','PostgreSQL'],
  },
];

async function request(method, path, body, token) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  try { return { ok: res.ok, status: res.status, data: JSON.parse(text) }; }
  catch { return { ok: res.ok, status: res.status, data: text }; }
}

(async () => {
  // ── 1. Login via admin endpoint → get admin JWT ──────────────────────────
  console.log('🔐 Logging in...');
  const login = await request('POST', '/admin/login', { email, password });
  if (!login.ok) { console.error('❌ Login failed:', JSON.stringify(login.data, null, 2)); process.exit(1); }
  const token = login.data?.data?.token;
  console.log('✅ Logged in.\n');

  // ── 2. Read existing slugs via Content Manager (accepts admin JWT) ────────
  const CM = '/content-manager/collection-types/api::service.service';
  const existing = await request('GET', `${CM}?fields=slug&pageSize=100`, null, token);
  const existingSlugs = (existing.data?.results ?? []).map(s => s.slug).filter(Boolean);
  if (existingSlugs.length) console.log(`ℹ️  Existing: ${existingSlugs.join(', ')}`);

  // ── 3. Create missing services via Content Manager ────────────────────────
  for (const svc of services) {
    if (existingSlugs.includes(svc.slug)) { console.log(`⏭  Skip "${svc.title}"`); continue; }
    console.log(`➕ Creating "${svc.title}"...`);
    const result = await request('POST', CM, {
      title: svc.title,
      description: svc.description,
      overview: svc.overview,
      slug: svc.slug,
      order: svc.order,
      subServices: svc.subServices,
      technologies: svc.technologies.map(name => ({ name })),
      publishedAt: new Date().toISOString(),
    }, token);
    if (result.ok) console.log(`   ✅ Created (id: ${result.data?.id ?? result.data?.documentId ?? '?'})`);
    else console.error(`   ❌ Failed:`, JSON.stringify(result.data, null, 2));
  }
  console.log('\n🎉 Done! Grant public find + findOne on Service in Strapi Admin → Settings → Roles → Public.');
})();
