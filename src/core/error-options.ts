export type ErrorCraftOptions = {
  cause?: unknown;
  data?: Record<string, unknown>;
};

export type BaseErrorOptions = ErrorCraftOptions & {
  code: string;
};

export type ApplicationErrorOptions = ErrorCraftOptions & {
  code: string;
};

export type SerializedError = {
  name: string;
  message: string;
  code: string;
  statusCode?: number;
  data?: Record<string, unknown>;
};

export type SerializeErrorOptions = {
  includeData?: boolean;
};
