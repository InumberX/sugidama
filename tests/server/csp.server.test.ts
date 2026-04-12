import { describe, it, expect, vi } from 'vitest'

const mockEnv = vi.hoisted(() => ({
  API_URL: 'https://api.example.com',
}))

vi.mock('~/config/env', () => mockEnv)

import { buildCspDirective } from '~/server/csp.server'

describe('csp.server', () => {
  describe('buildCspDirective', () => {
    it('includes the nonce in script-src', () => {
      const csp = buildCspDirective('test-nonce-123')
      expect(csp).toContain("'nonce-test-nonce-123'")
    })

    it('returns a semicolon-separated directive string', () => {
      const csp = buildCspDirective('nonce')
      const directives = csp.split('; ')
      expect(directives.length).toBe(13)
    })

    it('includes all required directive types', () => {
      const csp = buildCspDirective('nonce')
      expect(csp).toContain('default-src')
      expect(csp).toContain('script-src')
      expect(csp).toContain('style-src')
      expect(csp).toContain('font-src')
      expect(csp).toContain('img-src')
      expect(csp).toContain('connect-src')
      expect(csp).toContain('frame-src')
      expect(csp).toContain('media-src')
      expect(csp).toContain('worker-src')
      expect(csp).toContain('object-src')
      expect(csp).toContain('base-uri')
      expect(csp).toContain('form-action')
      expect(csp).toContain('frame-ancestors')
    })

    it("quotes 'self' keyword correctly", () => {
      const csp = buildCspDirective('nonce')
      expect(csp).toContain("default-src 'self'")
      expect(csp).toContain("base-uri 'self'")
      expect(csp).toContain("form-action 'self'")
    })

    it("quotes 'none' keyword correctly", () => {
      const csp = buildCspDirective('nonce')
      expect(csp).toContain("object-src 'none'")
      expect(csp).toContain("frame-ancestors 'none'")
    })

    it("quotes 'unsafe-inline' keyword correctly", () => {
      const csp = buildCspDirective('nonce')
      expect(csp).toContain("style-src 'self' 'unsafe-inline'")
    })

    it('does NOT quote data: and blob: scheme sources', () => {
      const csp = buildCspDirective('nonce')
      const imgDirective = csp.split('; ').find((d) => d.startsWith('img-src'))
      expect(imgDirective).toContain(' data:')
      expect(imgDirective).toContain(' blob:')
      expect(imgDirective).not.toContain("'data:'")
      expect(imgDirective).not.toContain("'blob:'")
    })

    it('includes blob: without quotes in media-src and worker-src', () => {
      const csp = buildCspDirective('nonce')
      const mediaSrc = csp.split('; ').find((d) => d.startsWith('media-src'))
      const workerSrc = csp.split('; ').find((d) => d.startsWith('worker-src'))
      expect(mediaSrc).toContain(' blob:')
      expect(workerSrc).toContain(' blob:')
      expect(mediaSrc).not.toContain("'blob:'")
      expect(workerSrc).not.toContain("'blob:'")
    })

    it("includes 'strict-dynamic' in script-src", () => {
      const csp = buildCspDirective('nonce')
      const scriptSrc = csp.split('; ').find((d) => d.startsWith('script-src'))
      expect(scriptSrc).toContain("'strict-dynamic'")
    })

    it('allows Google Fonts in style-src and font-src', () => {
      const csp = buildCspDirective('nonce')
      expect(csp).toContain('https://fonts.googleapis.com')
      expect(csp).toContain('https://fonts.gstatic.com')
    })

    it('includes API_URL in img-src and connect-src', () => {
      const csp = buildCspDirective('nonce')
      const imgSrc = csp.split('; ').find((d) => d.startsWith('img-src'))
      const connectSrc = csp.split('; ').find((d) => d.startsWith('connect-src'))
      expect(imgSrc).toContain('https://api.example.com')
      expect(connectSrc).toContain('https://api.example.com')
    })

    it('includes Kuroco image CDN in img-src', () => {
      const csp = buildCspDirective('nonce')
      const imgSrc = csp.split('; ').find((d) => d.startsWith('img-src'))
      expect(imgSrc).toContain('https://afterworks.g.kuroco-img.app')
    })

    it('includes Google ads audience pixel in img-src', () => {
      const csp = buildCspDirective('nonce')
      const imgSrc = csp.split('; ').find((d) => d.startsWith('img-src'))
      expect(imgSrc).toContain('https://www.google.co.jp')
    })

    it('includes Sentry in connect-src', () => {
      const csp = buildCspDirective('nonce')
      const connectSrc = csp.split('; ').find((d) => d.startsWith('connect-src'))
      expect(connectSrc).toContain('https://*.sentry.io')
    })

    it('includes Google in connect-src', () => {
      const csp = buildCspDirective('nonce')
      const connectSrc = csp.split('; ').find((d) => d.startsWith('connect-src'))
      expect(connectSrc).toContain('https://www.google.com')
    })

    it('includes Google Analytics in connect-src', () => {
      const csp = buildCspDirective('nonce')
      const connectSrc = csp.split('; ').find((d) => d.startsWith('connect-src'))
      expect(connectSrc).toContain('https://*.google-analytics.com')
      expect(connectSrc).toContain('https://analytics.google.com')
    })

    it('includes googletagmanager in connect-src', () => {
      const csp = buildCspDirective('nonce')
      const connectSrc = csp.split('; ').find((d) => d.startsWith('connect-src'))
      expect(connectSrc).toContain('https://www.googletagmanager.com')
    })

    it('includes googletagmanager in script-src and frame-src', () => {
      const csp = buildCspDirective('nonce')
      const scriptSrc = csp.split('; ').find((d) => d.startsWith('script-src'))
      const frameSrc = csp.split('; ').find((d) => d.startsWith('frame-src'))
      expect(scriptSrc).toContain('https://www.googletagmanager.com')
      expect(frameSrc).toContain('https://www.googletagmanager.com')
    })

    it('filters out falsy values from img-src and connect-src', () => {
      mockEnv.API_URL = ''
      const csp = buildCspDirective('nonce')
      const imgSrc = csp.split('; ').find((d) => d.startsWith('img-src'))
      const connectSrc = csp.split('; ').find((d) => d.startsWith('connect-src'))
      expect(imgSrc).not.toMatch(/\s{2,}/)
      expect(connectSrc).not.toMatch(/\s{2,}/)
      // Restore
      mockEnv.API_URL = 'https://api.example.com'
    })
  })
})
