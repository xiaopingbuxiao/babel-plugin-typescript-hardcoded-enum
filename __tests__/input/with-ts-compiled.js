const HOHOHO = {}

const SuccessCode = {
  HOHO: {
    HAHA_COMMON: {
      SuccessCode: {
        OK: 'OK',
        FAIL: 'FAIL'
      }
    }
  }
}

const ErrorCode = Multiple1.Code
const P = HOHOHO.Code

const ErrorToString = (code) => {
  const readableString = {
    [ErrorCode.success]: '0',
    [ErrorCode.fail]: '1',
    [SuccessCode.HOHO.HAHA_COMMON.SuccessCode.OK]: '4',
    [SuccessCode.HOHO.HAHA_COMMON.SuccessCode.FAIL]: '5',
    [P.A]: 'undefined'
  }[code]
  return readableString || '未知错误，保留现场，联系研发'
}
