# babel-plugin-typescript-hardcoded-enum

 
 中文  |  [English](./REMADE_en.md)


## Description

让你在 `babel` 编译的 `typescript` 项目中，轻松使用 `enum`

### ts-loader 和 @babel/preset-typescript

当你像下面这样组织项目的 `typings` 并使用 `enum` 时，在 `ts-loader` 编译的项目中一切都是正常且可行的。但是在 `@babel/preset-typescript` 编译的项目，这会导致一个运行时的错误， `ecom is undefined`。

并且 `babel` 将 `typescript` 的枚举编译为对象，这将会增加项目的体积，[具体点击这里](https://babeljs.io/docs/en/babel-preset-typescript#optimizeconstenums) 。

`babel-plugin-typescript-hardcoded-enum` 就是为了解决这个问题，让你在 `babel` 编译的项目中轻松使用 `enum`。提取枚举值进行硬编码

```typescript
// xx.ts
import openmind = ecom.governance.openmind;
const Test1: ecom.governance.openmind.EventTypeRequest = {
  id: "111",
  eventType: ecom.governance.openmind.EventType.MQ,
};
const EventTypeMap: Record<ecom.governance.openmind.EventType, string> = {
  [ecom.governance.openmind.EventType.Online]: "在线",
  [ecom.governance.openmind.EventType.Offline]: "离线",
  [openmind.EventType.RPC]: "接口",
  [openmind.EventType.MQ]: "消息",
};
console.log(ecom.governance.openmind.DecisionTreeStatus.Assessing);
```

```typescript
// xx.d.ts
declare namespace ecom.governance.openmind {
  export const enum DecisionTreeStatus {
    Draft = 1,
    Waiting = 2,
    Pending = 3,
    Releasing = 4,
    Running = 5,
    Disabled = 6,
    Assessing = 7,
  }

  export const enum EventType {
    Online = 1,
    Offline = 2,
    RPC = 3,
    MQ = 4,
  }
  export interface EventTypeRequest {
    eventType: EventType;
    id: string;
  }
  // ....
}
```

## 使用

```json
// babel.config.json
{
  "plugins": [
    [
        "babel-plugin-typescript-hardcoded-enum",
        {
            "typingsRoot":"" //
        }
    ]
  ];
}
```
### typingsRoot 

`typingsRoot` 为当前项目的 `typings` 文件夹路径(会查到当前路径下的所有 `d.ts` 文件)，也可以是一个 `d.ts` 的路径。设置为即可开始轻松使用 `const enum`。使用 `babel-plugin-typescript-hardcoded-enum` 后，上面的代码将编译
``` js
/* eslint-disable @typescript-eslint/no-unused-vars */
const Test1 = {
  id: '111',
  eventType: 4
};
const EventTypeMap = {
  1: '在线',
  2: '离线',
  3: '接口',
  4: '消息'
};
console.log(7)
```

## 说明
本项目 fork 自 babel-plugin-typescript-const-enum 开发。


