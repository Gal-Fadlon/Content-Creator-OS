/**
 * Timeout utilities for async operations
 * Prevents requests from hanging indefinitely
 */

/**
 * Wraps a promise or thenable with a timeout
 * @param promiseOrThenable The promise or thenable to wrap
 * @param timeoutMs Timeout in milliseconds (default: 30 seconds)
 * @param errorMessage Custom error message
 */
export async function withTimeout<T>(
  promiseOrThenable: Promise<T> | PromiseLike<T>,
  timeoutMs: number = 30000,
  errorMessage: string = 'Request timed out'
): Promise<T> {
  // Convert thenable to proper Promise to ensure it has catch/finally
  const promise = Promise.resolve(promiseOrThenable);
  let timeoutId: NodeJS.Timeout;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(errorMessage));
    }, timeoutMs);
  });

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    clearTimeout(timeoutId!);
    return result;
  } catch (error) {
    clearTimeout(timeoutId!);
    throw error;
  }
}

/**
 * Fetch with timeout using AbortController
 * @param url URL to fetch
 * @param options Fetch options
 * @param timeoutMs Timeout in milliseconds (default: 30 seconds)
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = 30000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  }
}
