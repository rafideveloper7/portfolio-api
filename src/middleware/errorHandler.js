export function errorHandler(error, request, response, next) {
  console.error(error)
  return response.status(500).json({
    error: error.message || 'Unexpected server error.',
  })
}
