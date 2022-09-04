# babel-plugin-typescript-hardcoded-enum

[中文](./README.md) | English

## Description

This plugin can resolve typescript enum to hard code.

### ts-loader 和 @babel/preset-typescript

when you use enum like this。

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

In projects compiled by `ts-loader(transpileOnly : false)` everything is fine and working. But in projects compiled by `@babel/preset-typescript` or `ts-loader(transpileOnly : true)` , this results in a runtime error, `ecom is undefined`.

`babel-plugin-typescript-hardcoded-enum` plugin can resolve enum to hard code like `ts-loader(transpileOnly : false)`.

## how to use

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

`typingsRoot` is the path to the `typings` folder of the current project (all `d.ts` files under the current path will be looked up), or it can be the path to a `d.ts`. With `babel-plugin-typescript-hardcoded-enum`, the above code will compiled like this

```js
/* eslint-disable @typescript-eslint/no-unused-vars */
const Test1 = {
  id: "111",
  eventType: 4,
};
const EventTypeMap = {
  1: "在线",
  2: "离线",
  3: "接口",
  4: "消息",
};
console.log(7);
```
