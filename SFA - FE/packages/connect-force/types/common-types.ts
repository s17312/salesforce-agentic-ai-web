export type DatePickerValues = {
  date: string | Date;
};
export type Details = {
  category: number;
  code: string;
  description: string;
  element: string;
  elementValue: string;
  location: string;
};

export type ErrorData = {
  description: string;
  details: Details[];
  logs: any[];
  messageSource: string;
  responseCode: string;
};

export type ErrorResponse = {
  data: ErrorData;
};

export type ErrorType = {
  response: ErrorResponse;
};
