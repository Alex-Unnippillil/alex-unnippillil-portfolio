import { DomainError, ErrorCode, errorMessages, handleError, invariant } from '../../src/utils/errors';

describe('invariant', () => {
  it('does nothing when condition is true', () => {
    expect(() => invariant(true, ErrorCode.MISSING_DATA)).not.toThrow();
  });

  it('throws DomainError with provided code', () => {
    expect(() => invariant(false, ErrorCode.MISSING_DATA)).toThrow(DomainError);
  });
});

describe('handleError', () => {
  it('maps DomainError to friendly message', () => {
    const err = new DomainError(ErrorCode.MISSING_DATA);
    const handled = handleError(err);
    expect(handled).toEqual({ code: ErrorCode.MISSING_DATA, message: errorMessages[ErrorCode.MISSING_DATA] });
  });

  it('maps another DomainError code to correct message', () => {
    const err = new DomainError(ErrorCode.INVALID_STATE);
    const handled = handleError(err);
    expect(handled).toEqual({ code: ErrorCode.INVALID_STATE, message: errorMessages[ErrorCode.INVALID_STATE] });
  });

  it('converts unknown error to unknown code and message', () => {
    const err = new Error('boom');
    const handled = handleError(err);
    expect(handled).toEqual({ code: ErrorCode.UNKNOWN, message: errorMessages[ErrorCode.UNKNOWN] });
  });
});
