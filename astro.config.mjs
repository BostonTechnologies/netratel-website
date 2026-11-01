import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const item = (label, path) => ({ label, link: path ? `/docs/${path}/` : "/docs/" });
export default defineConfig({
  site: process.env.SITE_URL || 'https://netratel.hello43031.chatgpt.site',
  output: 'static',
  server: { allowedHosts: ['terminal.local'] },
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  integrations: [starlight({
    title: 'NetRatel',
    disable404Route: true,
    description: 'Practical documentation for NetRatel, the self-hosted automation orchestrator.',
    favicon: '/brand/netratel-mark-32.png',
    defaultLocale: 'root',
    locales: { root: { label: 'English', lang: 'en' } },
    editLink: { baseUrl: 'https://github.com/BostonTechnologies/netratel-website/edit/main/' },
    lastUpdated: false,
    pagination: true,
    tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
    customCss: ['./src/styles/docs.css'],
    components: {
      Header: './src/components/DocsHeader.astro',
      Footer: './src/components/DocsFooter.astro',
      ThemeSelect: './src/components/Empty.astro',
      ThemeProvider: './src/components/DarkTheme.astro',
    },
    head: [
      { tag: 'meta', attrs: { name: 'theme-color', content: '#080c14' } },
      { tag: 'meta', attrs: { property: 'og:image', content: `${process.env.SITE_URL || 'https://netratel.hello43031.chatgpt.site'}/brand/netratel-social-preview.webp` } },
      { tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/brand/apple-touch-icon.png' } },
    ],
    sidebar: [
      { label: 'Start here', items: [
        item('Documentation', ''), item('Quickstart', 'getting-started/quickstart'),
        item('Requirements', 'getting-started/requirements'), item('Connect your first client', 'getting-started/first-client'),
      ] },
      { label: 'Deployment', collapsed: false, items: [
        item('Choose a deployment', 'deployment/overview'), item('Docker Compose', 'deployment/docker-compose'),
        item('Public HTTPS', 'deployment/public-https'), item('Reverse proxy & gateways', 'deployment/reverse-proxy'),
        item('External PostgreSQL', 'deployment/external-postgresql'), item('Upgrade NetRatel', 'deployment/upgrades'),
      ] },
      { label: 'Identity & access', collapsed: true, items: [
        item('Choose a sign-in method', 'identity/overview'), item('Local accounts', 'identity/local'),
        item('OpenID Connect', 'identity/oidc'), item('Hybrid sign-in', 'identity/hybrid'), item('Users & tenants', 'identity/users-and-tenants'),
      ] },
      { label: 'Operate your fleet', collapsed: true, items: [
        item('Manage clients', 'guides/clients'), item('Inventory & health', 'guides/inventory'),
        item('Software inventory', 'guides/software-inventory'),
        item('Scripts', 'guides/scripts'), item('Jobs & schedules', 'guides/jobs'),
        item('Terminals & services', 'guides/terminal-and-services'), item('Files & logs', 'guides/files-and-logs'),
        item('Monitoring', 'guides/monitoring'), item('Alert flows', 'guides/flows'), item('Notifications', 'guides/notifications'),
        item('Client updates', 'guides/updates'), item('Windows computer use', 'guides/computer-use'),
      ] },
      { label: 'Integrations & AI', collapsed: true, items: [
        item('Choose an integration', 'integrations/overview'), item('Integration credentials', 'integrations/credentials'),
        item('HTTP MCP', 'integrations/http-mcp'), item('stdio MCP', 'integrations/stdio'),
        item('Operator policies', 'integrations/operator-policies'), item('Netclaw & AI Ops', 'integrations/netclaw'), item('RatelDesk', 'integrations/rateldesk'),
      ] },
      { label: 'Reference & support', collapsed: true, items: [
        item('Product specification', 'reference/product-specification'),
        item('Architecture', 'reference/architecture'), item('Command-line interface', 'reference/cli'),
        item('Configuration', 'reference/configuration'), item('Security model', 'reference/security'),
        item('Backup & restore', 'guides/backup-and-restore'), item('Troubleshooting', 'guides/troubleshooting'),
      ] },
    ],
  })],
});
