export class CodedError extends Error {
  constructor(readonly code: string) {
    super(code);
  }
}

export function errorCode(error: unknown): string {
  return error instanceof CodedError ? error.code : "unknown";
}
