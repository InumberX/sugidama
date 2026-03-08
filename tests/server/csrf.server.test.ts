import { afterEach, describe, it, expect, vi } from 'vitest'

import {
  generateCsrfToken,
  createCsrfCookieHeader,
  getCsrfTokenFromCookie,
  validateCsrfRequest,
} from '~/server/csrf.server'

describe('csrf.server', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  describe('generateCsrfToken', () => {
    it('returns a 64-character hex string', () => {
      const token = generateCsrfToken()
      expect(token).toMatch(/^[0-9a-f]{64}$/)
    })

    it('generates unique tokens on each call', () => {
      const token1 = generateCsrfToken()
      const token2 = generateCsrfToken()
      expect(token1).not.toBe(token2)
    })
  })

  describe('createCsrfCookieHeader', () => {
    it('returns a Set-Cookie header string with the token', () => {
      const token = 'abc123'
      const header = createCsrfCookieHeader(token)
      expect(header).toContain('_csrf=abc123')
      expect(header).toContain('Path=/')
      expect(header).toContain('SameSite=Lax')
    })

    it('sets httpOnly to false so client can read it', () => {
      const header = createCsrfCookieHeader('token')
      // httpOnly: false means the HttpOnly flag should NOT be present
      expect(header).not.toContain('HttpOnly')
    })

    it('does not set Secure flag in non-production', () => {
      const header = createCsrfCookieHeader('token')
      expect(header).not.toContain('Secure')
    })

    it('sets Secure flag in production', () => {
      vi.stubEnv('NODE_ENV', 'production')
      const header = createCsrfCookieHeader('token')
      expect(header).toContain('Secure')
    })
  })

  describe('getCsrfTokenFromCookie', () => {
    it('extracts the CSRF token from a Cookie header', () => {
      const request = new Request('http://localhost/', {
        headers: { Cookie: '_csrf=mytoken123; other=value' },
      })
      expect(getCsrfTokenFromCookie(request)).toBe('mytoken123')
    })

    it('returns undefined when no Cookie header exists', () => {
      const request = new Request('http://localhost/')
      expect(getCsrfTokenFromCookie(request)).toBeUndefined()
    })

    it('returns undefined when _csrf cookie is not present', () => {
      const request = new Request('http://localhost/', {
        headers: { Cookie: 'session=abc; other=value' },
      })
      expect(getCsrfTokenFromCookie(request)).toBeUndefined()
    })

    it('returns undefined when _csrf cookie is empty', () => {
      const request = new Request('http://localhost/', {
        headers: { Cookie: '_csrf=; other=value' },
      })
      expect(getCsrfTokenFromCookie(request)).toBeUndefined()
    })

    it('handles _csrf as the only cookie', () => {
      const request = new Request('http://localhost/', {
        headers: { Cookie: '_csrf=singletoken' },
      })
      expect(getCsrfTokenFromCookie(request)).toBe('singletoken')
    })
  })

  describe('validateCsrfRequest', () => {
    it('passes when cookie token matches header token', async () => {
      const token = 'valid-token-123'
      const request = new Request('http://localhost/', {
        method: 'POST',
        headers: {
          Cookie: `_csrf=${token}`,
          'X-CSRF-Token': token,
        },
      })
      await expect(validateCsrfRequest(request)).resolves.toBeUndefined()
    })

    it('throws 403 when cookie token is missing', async () => {
      const request = new Request('http://localhost/', {
        method: 'POST',
        headers: {
          'X-CSRF-Token': 'some-token',
        },
      })
      try {
        await validateCsrfRequest(request)
        expect.fail('should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(Response)
        expect((error as Response).status).toBe(403)
      }
    })

    it('throws 403 when header token is missing and no form body', async () => {
      const request = new Request('http://localhost/', {
        method: 'POST',
        headers: {
          Cookie: '_csrf=some-token',
        },
      })
      try {
        await validateCsrfRequest(request)
        expect.fail('should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(Response)
        expect((error as Response).status).toBe(403)
      }
    })

    it('throws 403 when tokens do not match', async () => {
      const request = new Request('http://localhost/', {
        method: 'POST',
        headers: {
          Cookie: '_csrf=token-a',
          'X-CSRF-Token': 'token-b',
        },
      })
      try {
        await validateCsrfRequest(request)
        expect.fail('should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(Response)
        expect((error as Response).status).toBe(403)
      }
    })

    it('throws 403 when both tokens are missing', async () => {
      const request = new Request('http://localhost/', {
        method: 'POST',
      })
      try {
        await validateCsrfRequest(request)
        expect.fail('should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(Response)
        expect((error as Response).status).toBe(403)
      }
    })

    it('returns 403 response with error message', async () => {
      const request = new Request('http://localhost/', {
        method: 'POST',
      })
      try {
        await validateCsrfRequest(request)
        expect.fail('should have thrown')
      } catch (error) {
        const response = error as Response
        const body = await response.text()
        expect(body).toBe('Invalid CSRF token')
      }
    })

    it('passes when token is in form body instead of header (JS-disabled)', async () => {
      const token = 'form-body-token'
      const formData = new URLSearchParams({ _csrf: token, name: 'test' })
      const request = new Request('http://localhost/', {
        method: 'POST',
        headers: {
          Cookie: `_csrf=${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      })
      await expect(validateCsrfRequest(request)).resolves.toBeUndefined()
    })

    it('throws 403 when form body token does not match cookie', async () => {
      const formData = new URLSearchParams({ _csrf: 'wrong-token', name: 'test' })
      const request = new Request('http://localhost/', {
        method: 'POST',
        headers: {
          Cookie: '_csrf=correct-token',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      })
      try {
        await validateCsrfRequest(request)
        expect.fail('should have thrown')
      } catch (error) {
        expect(error).toBeInstanceOf(Response)
        expect((error as Response).status).toBe(403)
      }
    })

    it('prefers header token over form body token', async () => {
      const token = 'header-token'
      const formData = new URLSearchParams({ _csrf: 'form-token' })
      const request = new Request('http://localhost/', {
        method: 'POST',
        headers: {
          Cookie: `_csrf=${token}`,
          'X-CSRF-Token': token,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      })
      await expect(validateCsrfRequest(request)).resolves.toBeUndefined()
    })
  })
})
