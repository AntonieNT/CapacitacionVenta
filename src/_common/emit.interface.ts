export interface EventInterface {
  code: number;

  timestamp: Date;

  message: string;

  entity: string;

  success: boolean;

  host: string;

  ip: string;

  path: string;

  cookies: string;

  userAgent: string;

  params: string;

  method: string;

  body: string;

  exception: boolean;
}
