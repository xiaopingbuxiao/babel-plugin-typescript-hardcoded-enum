
declare namespace ecom.governance.openmind {
  export const enum DecisionTreeStatus {
    /** 配置中 */
    Draft = 1,
    /** 未开启 */
    Waiting = 2,
    /** 待审核 */
    Pending = 3,
    /** 灰度发布中 */
    Releasing = 4,
    /** 已上线 */
    Running = 5,
    /** 已失效，终态 */
    Disabled = 6,
    /** 评估中 */
    Assessing = 7
  }

  export const enum EventType {
    /** 在线（旧） */
    Online = 1,
    /** 离线 */
    Offline = 2,
    /** 接口 */
    RPC = 3,
    /** 消息 */
    MQ = 4
  }

  export interface EventTypeRequest {
    eventType: EventType
    id: string
  }

  export class Service {
    public async getInfoById (params: EventTypeRequest): Promise<any> {
    }
  }
}
