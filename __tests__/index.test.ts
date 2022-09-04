
import * as babel from '@babel/core'
import * as fs from 'fs'
import path from 'path'

import babelPluginTypescriptEnum from '../src/index'

const inputDir = path.resolve(__dirname, './input')
const typingsRoot = path.resolve(__dirname, './typings')

describe('babel-plugin-typescript-enum', () => {
  test('will renamed namespace success', async () => {
    const input = await fs.promises.readFile(path.resolve(inputDir, './with-renamed-namespace.ts'), 'utf-8')
    const result = await babel.transformAsync(input, {
      presets: ['@babel/preset-typescript'],
      filename: 'input.ts',
      plugins: [
        [
          babelPluginTypescriptEnum, { typingsRoot }
        ]
      ]
    })
    expect(result?.code).toMatchInlineSnapshot(`
"/* eslint-disable @typescript-eslint/no-unused-vars */
const Test1 = {
  id: '111',
  eventType: 4
  /*MQ*/

};
const EventTypeMap = {
  [1
  /*Online*/
  ]: '在线',
  [2
  /*Offline*/
  ]: '离线',
  [3
  /*RPC*/
  ]: '接口',
  [4
  /*MQ*/
  ]: '消息'
};
console.log(7
/*Assessing*/
);"
`)
  })
  test('without renamed namespace ', async () => {
    const input = await fs.promises.readFile(path.resolve(inputDir, './without-renamed-namespace.ts'), 'utf-8')
    const result = await babel.transformAsync(input, {
      presets: ['@babel/preset-typescript'],
      filename: 'input.ts',
      plugins: [
        [
          babelPluginTypescriptEnum, { typingsRoot }
        ]
      ]
    })
    expect(result?.code).toMatchInlineSnapshot(`
"/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/explicit-function-return-type */
function fn() {
  const ecom = {
    governance: {
      openmind: {
        EventType: {
          Online: '可以成功解析，不被替换'
        }
      }
    }
  };

  function A() {
    return ecom.governance.openmind.EventType;
  }

  function B() {
    const openmind = ecom.governance.openmind;
    console.log(openmind.EventType.Online);
    return openmind;
  }

  return ecom.governance.openmind.EventType;
}"
`)
  })

  test('with ts compiled', async () => {
    const input = await fs.promises.readFile(path.resolve(inputDir, './with-ts-compiled.js'), 'utf-8')
    const result = await babel.transformAsync(input, {
      presets: ['@babel/preset-typescript'],
      filename: 'input.ts',
      plugins: [
        [
          babelPluginTypescriptEnum, { typingsRoot }
        ]
      ]
    })
    expect(result?.code).toMatchInlineSnapshot(`
"const HOHOHO = {};
const SuccessCode = {
  HOHO: {
    HAHA_COMMON: {
      SuccessCode: {
        OK: 'OK',
        FAIL: 'FAIL'
      }
    }
  }
};
const P = HOHOHO.Code;

const ErrorToString = code => {
  const readableString = {
    [0
    /*success*/
    ]: '0',
    [1
    /*fail*/
    ]: '1',
    [SuccessCode.HOHO.HAHA_COMMON.SuccessCode.OK]: '4',
    [SuccessCode.HOHO.HAHA_COMMON.SuccessCode.FAIL]: '5',
    [P.A]: 'undefined'
  }[code];
  return readableString || '未知错误，保留现场，联系研发';
};"
`)
  })
})
