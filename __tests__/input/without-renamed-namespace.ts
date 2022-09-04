/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

function fn () {
  const ecom = {
    governance: {
      openmind: {
        EventType: {
          Online: '可以成功解析，不被替换'
        }
      }
    }
  }
  function A () {
    return ecom.governance.openmind.EventType
  }
  function B () {
    const openmind = ecom.governance.openmind
    console.log(openmind.EventType.Online)
    return openmind
  }
  return ecom.governance.openmind.EventType
}
