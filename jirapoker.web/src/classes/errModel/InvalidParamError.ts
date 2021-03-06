import { i18n } from '@/modules/i18n';
export default class InvalidParamError extends Error {
  public action: string;
  public params: string[];

  constructor(message?: string, action?: string, params?: string[]) {
    super(message);
    this.name = 'InvalidParamError';
    this.action = String(action);
    this.stack = new Error().stack;

    if (params) {
      this.message = `Invalid params: ${params.join()}. ${this.message}`;
    }
  }

  public toServerString = (): string => {
    return `[${this.name}][${this.action}] ${this.message}`;
  }

  public toString = (): string => {
    return i18n.tc('msg.error.httpRequestError');
  }
}
