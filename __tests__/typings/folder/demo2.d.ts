
declare namespace demo2.Test {

  export const enum IsUserEditedValue {
    /** 更改 */
    Edited = 1,
    /** 未更改 */
    NotEdited = 2
  }

}

declare namespace demo2 {
  export const enum Hello {
    hello = '你好',
    world = '世界'
  }
}

declare enum GlobalEnum {
  A = 1,
  b = 'one'
}
