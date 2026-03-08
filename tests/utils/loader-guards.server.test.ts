import { cleanup } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'

import { parseNumberParam, parseNumberParams, ensureCondition } from '~/utils/loader-guards.server'

describe('Loader Guards Server Utils', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  //============================================================================
  // 1. parseNumberParam
  //============================================================================
  describe('parseNumberParam', () => {
    describe('Success cases', () => {
      it('should parse valid positive number string', () => {
        const result = parseNumberParam('123', 'testParam')
        expect(result).toBe(123)
      })

      it('should parse valid negative number string', () => {
        const result = parseNumberParam('-456', 'testParam')
        expect(result).toBe(-456)
      })

      it('should parse zero', () => {
        const result = parseNumberParam('0', 'testParam')
        expect(result).toBe(0)
      })

      it('should parse number without paramName', () => {
        const result = parseNumberParam('789')
        expect(result).toBe(789)
      })

      it('should parse number string with leading/trailing spaces (parseInt behavior)', () => {
        const result = parseNumberParam('  42  ', 'testParam')
        expect(result).toBe(42)
      })
    })

    describe('Error cases', () => {
      it('should throw 404 Response when param is undefined', () => {
        expect(() => parseNumberParam(undefined, 'testParam')).toThrow(Response)
        try {
          parseNumberParam(undefined, 'testParam')
        } catch (error) {
          expect(error).toBeInstanceOf(Response)
          expect((error as Response).status).toBe(404)
        }
      })

      it('should throw 404 Response when param is null', () => {
        expect(() => parseNumberParam(null, 'testParam')).toThrow(Response)
        try {
          parseNumberParam(null, 'testParam')
        } catch (error) {
          expect(error).toBeInstanceOf(Response)
          expect((error as Response).status).toBe(404)
        }
      })

      it('should throw 404 Response when param is empty string', () => {
        expect(() => parseNumberParam('', 'testParam')).toThrow(Response)
        try {
          parseNumberParam('', 'testParam')
        } catch (error) {
          expect(error).toBeInstanceOf(Response)
          expect((error as Response).status).toBe(404)
        }
      })

      it('should throw 404 Response when param is not a number', () => {
        expect(() => parseNumberParam('abc', 'testParam')).toThrow(Response)
        try {
          parseNumberParam('abc', 'testParam')
        } catch (error) {
          expect(error).toBeInstanceOf(Response)
          expect((error as Response).status).toBe(404)
        }
      })

      it('should throw 404 Response when param is NaN string', () => {
        expect(() => parseNumberParam('NaN', 'testParam')).toThrow(Response)
        try {
          parseNumberParam('NaN', 'testParam')
        } catch (error) {
          expect(error).toBeInstanceOf(Response)
          expect((error as Response).status).toBe(404)
        }
      })

      it('should include param name in error message when provided', () => {
        try {
          parseNumberParam(undefined, 'userId')
        } catch (error) {
          const response = error as Response
          expect(response.status).toBe(404)
        }
      })
    })
  })

  //============================================================================
  // 2. parseNumberParams
  //============================================================================
  describe('parseNumberParams', () => {
    describe('Success cases', () => {
      it('should parse single valid parameter', () => {
        const result = parseNumberParams({ id: '123' })
        expect(result).toEqual({ id: 123 })
      })

      it('should parse multiple valid parameters', () => {
        const result = parseNumberParams({
          projectId: '100',
          contactId: '200',
          userId: '300',
        })
        expect(result).toEqual({
          projectId: 100,
          contactId: 200,
          userId: 300,
        })
      })

      it('should parse parameters with negative numbers', () => {
        const result = parseNumberParams({
          id: '-50',
          count: '0',
        })
        expect(result).toEqual({
          id: -50,
          count: 0,
        })
      })
    })

    describe('Error cases', () => {
      it('should throw 404 Response when any parameter is undefined', () => {
        expect(() =>
          parseNumberParams({
            projectId: '100',
            contactId: undefined,
          })
        ).toThrow(Response)
      })

      it('should throw 404 Response when any parameter is null', () => {
        expect(() =>
          parseNumberParams({
            projectId: '100',
            contactId: null,
          })
        ).toThrow(Response)
      })

      it('should throw 404 Response when any parameter is invalid', () => {
        expect(() =>
          parseNumberParams({
            projectId: '100',
            contactId: 'invalid',
          })
        ).toThrow(Response)

        try {
          parseNumberParams({
            projectId: '100',
            contactId: 'invalid',
          })
        } catch (error) {
          expect(error).toBeInstanceOf(Response)
          expect((error as Response).status).toBe(404)
        }
      })

      it('should throw 404 Response when empty object is provided', () => {
        const result = parseNumberParams({})
        expect(result).toEqual({})
      })
    })
  })

  //============================================================================
  // 3. ensureCondition
  //============================================================================
  describe('ensureCondition', () => {
    describe('Success cases', () => {
      it('should not throw when condition is truthy', () => {
        expect(() => ensureCondition(true)).not.toThrow()
        expect(() => ensureCondition('value')).not.toThrow()
        expect(() => ensureCondition(123)).not.toThrow()
        expect(() => ensureCondition({ key: 'value' })).not.toThrow()
        expect(() => ensureCondition([1, 2, 3])).not.toThrow()
      })

      it('should accept condition with custom options without throwing', () => {
        expect(() =>
          ensureCondition('valid', {
            status: 403,
            message: 'Custom message',
          })
        ).not.toThrow()
      })
    })

    describe('Error cases', () => {
      it('should throw 404 Response by default when condition is falsy', () => {
        expect(() => ensureCondition(false)).toThrow(Response)
        try {
          ensureCondition(false)
        } catch (error) {
          expect(error).toBeInstanceOf(Response)
          expect((error as Response).status).toBe(404)
        }
      })

      it('should throw 404 Response when condition is null', () => {
        expect(() => ensureCondition(null)).toThrow(Response)
        try {
          ensureCondition(null)
        } catch (error) {
          expect(error).toBeInstanceOf(Response)
          expect((error as Response).status).toBe(404)
        }
      })

      it('should throw 404 Response when condition is undefined', () => {
        expect(() => ensureCondition(undefined)).toThrow(Response)
        try {
          ensureCondition(undefined)
        } catch (error) {
          expect(error).toBeInstanceOf(Response)
          expect((error as Response).status).toBe(404)
        }
      })

      it('should throw 404 Response when condition is empty string', () => {
        expect(() => ensureCondition('')).toThrow(Response)
        try {
          ensureCondition('')
        } catch (error) {
          expect(error).toBeInstanceOf(Response)
          expect((error as Response).status).toBe(404)
        }
      })

      it('should throw 404 Response when condition is 0', () => {
        expect(() => ensureCondition(0)).toThrow(Response)
        try {
          ensureCondition(0)
        } catch (error) {
          expect(error).toBeInstanceOf(Response)
          expect((error as Response).status).toBe(404)
        }
      })

      it('should throw with custom status code 401', () => {
        try {
          ensureCondition(false, { status: 401 })
        } catch (error) {
          expect(error).toBeInstanceOf(Response)
          expect((error as Response).status).toBe(401)
        }
      })

      it('should throw with custom status code 403', () => {
        try {
          ensureCondition(null, { status: 403 })
        } catch (error) {
          expect(error).toBeInstanceOf(Response)
          expect((error as Response).status).toBe(403)
        }
      })

      it('should throw with custom status code 500', () => {
        try {
          ensureCondition(undefined, { status: 500 })
        } catch (error) {
          expect(error).toBeInstanceOf(Response)
          expect((error as Response).status).toBe(500)
        }
      })

      it('should include custom message in response', () => {
        try {
          ensureCondition(false, {
            status: 404,
            message: 'Custom error message',
          })
        } catch (error) {
          expect(error).toBeInstanceOf(Response)
          const response = error as Response
          expect(response.status).toBe(404)
        }
      })
    })
  })
})
