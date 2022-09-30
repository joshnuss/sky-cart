export function success(extra = {}) {
  return {
    success: true,
    ...extra
  }
}

export function fail(errors) {
  return {
    success: false,
    errors
  }
}
