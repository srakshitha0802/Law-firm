import { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { JWTPayload } from '@/types'

export function getAuthToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  
  // Also check cookies
  const cookieHeader = request.headers.get('cookie')
  if (cookieHeader) {
    const tokenMatch = cookieHeader.match(/auth-token=([^;]+)/)
    if (tokenMatch) {
      return tokenMatch[1]
    }
  }
  
  return null
}

export function authenticateRequest(request: NextRequest): { 
  success: boolean
  user?: JWTPayload
  error?: string 
} {
  const token = getAuthToken(request)
  
  if (!token) {
    return { success: false, error: 'No authentication token provided' }
  }
  
  const payload = verifyToken(token)
  if (!payload) {
    return { success: false, error: 'Invalid or expired token' }
  }
  
  return { success: true, user: payload }
}

export function requireAuth(request: NextRequest): JWTPayload | Response {
  const auth = authenticateRequest(request)
  
  if (!auth.success) {
    return new Response(
      JSON.stringify({ error: auth.error }),
      { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
  
  return auth.user!
}

export function requireRole(request: NextRequest, allowedRoles: string[]): JWTPayload | Response {
  const userOrResponse = requireAuth(request)
  
  if (userOrResponse instanceof Response) {
    return userOrResponse
  }
  
  if (!allowedRoles.includes(userOrResponse.role)) {
    return new Response(
      JSON.stringify({ error: 'Insufficient permissions' }),
      { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
  
  return userOrResponse
}