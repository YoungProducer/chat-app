export enum E_ActionResponse {
  DEFAULT = 0,
  SUCCESS = 200,
  ERROR = 400,
  EMAIL_ALREADY_EXIST = 403,
  USER_NOT_FOUND = 404,
  INVALID_PASSWORD = 405,
}

export interface I_RequestResponse {
  data?: object;
  actionResponse: E_ActionResponse;
}
