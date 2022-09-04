
import path from 'path'
import { getDTSFiles, parseDTSEnumFac } from '../src/parseDts'

const typingsRoot = path.resolve(__dirname, './typings')
describe('test get dts files', () => {
  test('parameter is folder ', () => {
    expect(getDTSFiles(path.resolve(typingsRoot, './folder')).length).toEqual(3)
  })

  test('parameter is empty', () => {
    const files = getDTSFiles(path.resolve(typingsRoot, './empty'))
    expect(files).toStrictEqual([])
  })

  test('return arr must be absolute path', () => {
    const files = getDTSFiles(typingsRoot)
    const absolute = files.every(file => path.isAbsolute(file))
    expect(absolute).toBe(true)
  })

  test('parameter is file', () => {
    const files = getDTSFiles(path.resolve(typingsRoot, './folder/demo1.d.ts'))
    expect(files.length).toEqual(1)
    expect(Array.isArray(files)).toBe(true)
    expect(path.isAbsolute(files[0])).toBe(true)
  })
})

describe('test parse dts enum', () => {
  let parseDTSEnum: Function
  beforeEach(() => {
    parseDTSEnum = parseDTSEnumFac()
  })
  test('parseDTSEnumFac returnType is function ', () => {
    expect(typeof parseDTSEnum === 'function').toBe(true)
  })

  test('parse singe file success', () => {
    const enumJson = parseDTSEnum(path.resolve(typingsRoot, './folder/demo1.d.ts'))
    expect(enumJson).toMatchInlineSnapshot(`
{
  "ecom.governance.openmind.DecisionTreeStatus.Assessing": 7,
  "ecom.governance.openmind.DecisionTreeStatus.Disabled": 6,
  "ecom.governance.openmind.DecisionTreeStatus.Draft": 1,
  "ecom.governance.openmind.DecisionTreeStatus.Pending": 3,
  "ecom.governance.openmind.DecisionTreeStatus.Releasing": 4,
  "ecom.governance.openmind.DecisionTreeStatus.Running": 5,
  "ecom.governance.openmind.DecisionTreeStatus.Waiting": 2,
  "ecom.governance.openmind.EventType.MQ": 4,
  "ecom.governance.openmind.EventType.Offline": 2,
  "ecom.governance.openmind.EventType.Online": 1,
  "ecom.governance.openmind.EventType.RPC": 3,
}
`)
  })

  test('parse folder success', () => {
    const enumJson = parseDTSEnum(path.resolve(typingsRoot, './folder'))
    expect(enumJson).toMatchInlineSnapshot(`
{
  "GlobalEnum.A": 1,
  "GlobalEnum.b": "one",
  "demo2.Hello.hello": "你好",
  "demo2.Hello.world": "世界",
  "demo2.Test.IsUserEditedValue.Edited": 1,
  "demo2.Test.IsUserEditedValue.NotEdited": 2,
  "ecom.governance.openmind.DecisionTreeStatus.Assessing": 7,
  "ecom.governance.openmind.DecisionTreeStatus.Disabled": 6,
  "ecom.governance.openmind.DecisionTreeStatus.Draft": 1,
  "ecom.governance.openmind.DecisionTreeStatus.Pending": 3,
  "ecom.governance.openmind.DecisionTreeStatus.Releasing": 4,
  "ecom.governance.openmind.DecisionTreeStatus.Running": 5,
  "ecom.governance.openmind.DecisionTreeStatus.Waiting": 2,
  "ecom.governance.openmind.EventType.MQ": 4,
  "ecom.governance.openmind.EventType.Offline": 2,
  "ecom.governance.openmind.EventType.Online": 1,
  "ecom.governance.openmind.EventType.RPC": 3,
}
`)
  })

  test('a single file has multiple namespace', () => {
    const enumJson = parseDTSEnum(path.resolve(typingsRoot, './multipleNamespace.d.ts'))
    expect(enumJson).toMatchInlineSnapshot(`
{
  "Multiple1.Code.fail": 1,
  "Multiple1.Code.success": 0,
  "Multiple2.Code.error": 500,
  "Multiple2.Code.success": 200,
  "Multiple2.CustomCode.noAuth": 401,
  "Multiple2.CustomCode.serviceError": 500,
}
`)
  })

  test('parse auto-incremented success ', () => {
    const enumJson = parseDTSEnum(path.resolve(typingsRoot, 'declare.d.ts'))
    expect(enumJson).toMatchInlineSnapshot(`
{
  "AllType.a": 1,
  "AllType.b": -99,
  "AllType.c": "hello",
  "AllType.d": false,
  "AllType.e": true,
  "AutoNumber.a": 1,
  "AutoNumber.b": 2,
  "AutoNumber.c": 3,
  "AutoNumber.d": "你好世界",
  "AutoNumber.e": 10,
  "AutoNumber.f": 11,
  "AutoNumber.g": 12,
  "AutoNumber.hello": "hello",
  "AutoNumber.world": "world",
  "AutoNumber1.a": 0,
  "AutoNumber1.b": 1,
  "AutoNumber1.c": 2,
}
`)
  })
})
