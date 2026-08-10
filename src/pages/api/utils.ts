import { serializeError } from 'serialize-error';

export function withCORS(responseInit?: ResponseInit): ResponseInit {
  return {
    ...responseInit,
    headers: {
      ...responseInit?.headers,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  };
}

export function json(response: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(response), init);
}

export function handleUnexpectedError(error: unknown) {
  try {
    throw error;
  } catch (e) {
    console.error(e);
  }

  return invalidRequestResponse(serializeError(error), 500);
}

export function invalidRequestResponse(error: unknown, status = 422) {
  return json(
    {
      success: false,
      error,
    },
    withCORS({ status }),
  );
}

export function successfulResponse(data?: unknown, status = 200) {
  return json(
    {
      success: true,
      data,
    },
    withCORS({ status }),
  );
}

export function isRelativeUrl(path: string) {
  try {
    new URL(path);
    return false;
  } catch {
    try {
      new URL(path, 'http://example.com');
      return true;
    } catch {
      return false;
    }
  }
}
