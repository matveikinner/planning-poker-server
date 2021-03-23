class EVENT {}

namespace EVENT {
  enum SUCCESS {
    CREATE = 'Success while attempting to create a new event',
  }

  export enum TYPES {
    CONNECT = 'CONNECTION',
    DISCONNECT = 'DISCONNECT',
    CREATE = 'CREATE_EVENT',
    SUBSCRIBE = 'SUBSCRIBE_EVENT',
    UNSUBSCRIBE = 'UNSUBSCRIBE_EVENT',
    VOTE = 'VOTE_EVENT',
  }

  export class LOG {
    public static readonly SUCCESS = SUCCESS;
  }
}

export default EVENT;
