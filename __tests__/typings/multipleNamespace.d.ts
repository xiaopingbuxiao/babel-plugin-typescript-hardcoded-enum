declare namespace Multiple1 {
  const enum Code {
    success = 0,
    fail = 1
  }
}

declare namespace Multiple2 {
  export const enum Code {
    success = 200,
    error = 500
  }
  export const enum CustomCode {
    noAuth = 401,
    serviceError = 500
  }
}
