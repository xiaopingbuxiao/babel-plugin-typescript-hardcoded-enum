/* eslint-disable @typescript-eslint/no-unused-vars */

import IsUserEditedValue = demo2.Test.IsUserEditedValue

import openmind = ecom.governance.openmind

const Test1: ecom.governance.openmind.EventTypeRequest = {
  id: '111',
  eventType: ecom.governance.openmind.EventType.MQ
}

const EventTypeMap: Record<ecom.governance.openmind.EventType, string> = {
  [ecom.governance.openmind.EventType.Online]: '在线',
  [ecom.governance.openmind.EventType.Offline]: '离线',
  [openmind.EventType.RPC]: '接口',
  [openmind.EventType.MQ]: '消息'
}
console.log(ecom.governance.openmind.DecisionTreeStatus.Assessing)
