/**
 * Cloudflare Pages Function - API Proxy
 *
 * Proxies all requests from /api/* to https://api.pphub.cloud
 *
 * For example:
 * - /api/users -> https://api.pphub.cloud/users
 * - /api/posts/123 -> https://api.pphub.cloud/posts/123
 */

const BACKEND_API = 'https://api.pphub.cloud'

export async function onRequest(context) {
  const { request } = context

  // Get the original URL path (e.g., "/api/users")
  const url = new URL(request.url)
  const originalPath = url.pathname

  // Remove the /api prefix to get the backend path (e.g., "/users")
  const backendPath = originalPath.replace(/^\/api/, '')

  // Build the backend URL
  const backendUrl = `${BACKEND_API}${backendPath}${url.search}`

  // Clone the request and modify the URL
  const backendRequest = new Request(backendUrl, request)

  // Forward specific headers to the backend
  const headersToForward = [
    'accept',
    'accept-language',
    'content-type',
    'authorization',
    'x-requested-with',
  ]

  // Set forwarded headers
  backendRequest.headers.set('X-Forwarded-Host', url.hostname)
  backendRequest.headers.set('X-Forwarded-Proto', url.protocol.replace(':', ''))

  // Only forward specific headers from the original request
  for (const header of headersToForward) {
    const value = request.headers.get(header)
    if (value) {
      backendRequest.headers.set(header, value)
    }
  }

  try {
    // Forward the request to the backend
    const response = await fetch(backendRequest)

    // Create a new response with CORS headers if needed
    const modifiedResponse = new Response(response.body, response)

    // Forward CORS headers from backend or set your own
    const corsHeaders = response.headers.get('access-control-allow-origin')
    if (!corsHeaders) {
      modifiedResponse.headers.set('Access-Control-Allow-Origin', '*')
      modifiedResponse.headers.set(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS'
      )
      modifiedResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    }

    return modifiedResponse
  } catch (error) {
    // Return error response if backend is unreachable
    return new Response(
      JSON.stringify({
        error: 'Backend API unavailable',
        message: error.message,
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}

// Handle OPTIONS requests for CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
}
