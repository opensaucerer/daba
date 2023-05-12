export enum Pager {
  Sort = -1,
  Limit = 10,
  Offset = 0,
}

export enum Currency {
  NGN = 'ngn',
}

export enum HttpStatus {
  BadRequest = 'BAD_REQUEST',
  Unathorized = 'UNAUTHORIZED',
  Unauthenticaed = 'UNAUTHENTICATED',
}

export const StatusForCode: Record<number, HttpStatus> = {
  400: HttpStatus.BadRequest,
  401: HttpStatus.Unathorized,
  403: HttpStatus.Unauthenticaed,
};

export enum TransactionType {
  Deposit = 'deposit',
  Transfer = 'transfer',
}
