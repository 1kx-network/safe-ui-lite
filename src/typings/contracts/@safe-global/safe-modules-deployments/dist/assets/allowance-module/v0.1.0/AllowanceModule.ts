/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from 'ethers';
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from '../../../../../../common';

export interface AllowanceModuleInterface extends Interface {
  getFunction(
    nameOrSignature:
      | 'ALLOWANCE_TRANSFER_TYPEHASH'
      | 'DOMAIN_SEPARATOR_TYPEHASH'
      | 'NAME'
      | 'VERSION'
      | 'allowances'
      | 'delegates'
      | 'delegatesStart'
      | 'tokens'
      | 'setAllowance'
      | 'resetAllowance'
      | 'deleteAllowance'
      | 'executeAllowanceTransfer'
      | 'getChainId'
      | 'generateTransferHash'
      | 'getTokens'
      | 'getTokenAllowance'
      | 'addDelegate'
      | 'removeDelegate'
      | 'getDelegates'
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | 'AddDelegate'
      | 'DeleteAllowance'
      | 'ExecuteAllowanceTransfer'
      | 'PayAllowanceTransfer'
      | 'RemoveDelegate'
      | 'ResetAllowance'
      | 'SetAllowance'
  ): EventFragment;

  encodeFunctionData(functionFragment: 'ALLOWANCE_TRANSFER_TYPEHASH', values?: undefined): string;
  encodeFunctionData(functionFragment: 'DOMAIN_SEPARATOR_TYPEHASH', values?: undefined): string;
  encodeFunctionData(functionFragment: 'NAME', values?: undefined): string;
  encodeFunctionData(functionFragment: 'VERSION', values?: undefined): string;
  encodeFunctionData(
    functionFragment: 'allowances',
    values: [AddressLike, AddressLike, AddressLike]
  ): string;
  encodeFunctionData(functionFragment: 'delegates', values: [AddressLike, BigNumberish]): string;
  encodeFunctionData(functionFragment: 'delegatesStart', values: [AddressLike]): string;
  encodeFunctionData(
    functionFragment: 'tokens',
    values: [AddressLike, AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: 'setAllowance',
    values: [AddressLike, AddressLike, BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: 'resetAllowance',
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: 'deleteAllowance',
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: 'executeAllowanceTransfer',
    values: [
      AddressLike,
      AddressLike,
      AddressLike,
      BigNumberish,
      AddressLike,
      BigNumberish,
      AddressLike,
      BytesLike,
    ]
  ): string;
  encodeFunctionData(functionFragment: 'getChainId', values?: undefined): string;
  encodeFunctionData(
    functionFragment: 'generateTransferHash',
    values: [
      AddressLike,
      AddressLike,
      AddressLike,
      BigNumberish,
      AddressLike,
      BigNumberish,
      BigNumberish,
    ]
  ): string;
  encodeFunctionData(functionFragment: 'getTokens', values: [AddressLike, AddressLike]): string;
  encodeFunctionData(
    functionFragment: 'getTokenAllowance',
    values: [AddressLike, AddressLike, AddressLike]
  ): string;
  encodeFunctionData(functionFragment: 'addDelegate', values: [AddressLike]): string;
  encodeFunctionData(functionFragment: 'removeDelegate', values: [AddressLike, boolean]): string;
  encodeFunctionData(
    functionFragment: 'getDelegates',
    values: [AddressLike, BigNumberish, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: 'ALLOWANCE_TRANSFER_TYPEHASH', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'DOMAIN_SEPARATOR_TYPEHASH', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'NAME', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'VERSION', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'allowances', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'delegates', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'delegatesStart', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'tokens', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'setAllowance', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'resetAllowance', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'deleteAllowance', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'executeAllowanceTransfer', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getChainId', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'generateTransferHash', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getTokens', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getTokenAllowance', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'addDelegate', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'removeDelegate', data: BytesLike): Result;
  decodeFunctionResult(functionFragment: 'getDelegates', data: BytesLike): Result;
}

export namespace AddDelegateEvent {
  export type InputTuple = [safe: AddressLike, delegate: AddressLike];
  export type OutputTuple = [safe: string, delegate: string];
  export interface OutputObject {
    safe: string;
    delegate: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace DeleteAllowanceEvent {
  export type InputTuple = [safe: AddressLike, delegate: AddressLike, token: AddressLike];
  export type OutputTuple = [safe: string, delegate: string, token: string];
  export interface OutputObject {
    safe: string;
    delegate: string;
    token: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ExecuteAllowanceTransferEvent {
  export type InputTuple = [
    safe: AddressLike,
    delegate: AddressLike,
    token: AddressLike,
    to: AddressLike,
    value: BigNumberish,
    nonce: BigNumberish,
  ];
  export type OutputTuple = [
    safe: string,
    delegate: string,
    token: string,
    to: string,
    value: bigint,
    nonce: bigint,
  ];
  export interface OutputObject {
    safe: string;
    delegate: string;
    token: string;
    to: string;
    value: bigint;
    nonce: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace PayAllowanceTransferEvent {
  export type InputTuple = [
    safe: AddressLike,
    delegate: AddressLike,
    paymentToken: AddressLike,
    paymentReceiver: AddressLike,
    payment: BigNumberish,
  ];
  export type OutputTuple = [
    safe: string,
    delegate: string,
    paymentToken: string,
    paymentReceiver: string,
    payment: bigint,
  ];
  export interface OutputObject {
    safe: string;
    delegate: string;
    paymentToken: string;
    paymentReceiver: string;
    payment: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RemoveDelegateEvent {
  export type InputTuple = [safe: AddressLike, delegate: AddressLike];
  export type OutputTuple = [safe: string, delegate: string];
  export interface OutputObject {
    safe: string;
    delegate: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ResetAllowanceEvent {
  export type InputTuple = [safe: AddressLike, delegate: AddressLike, token: AddressLike];
  export type OutputTuple = [safe: string, delegate: string, token: string];
  export interface OutputObject {
    safe: string;
    delegate: string;
    token: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace SetAllowanceEvent {
  export type InputTuple = [
    safe: AddressLike,
    delegate: AddressLike,
    token: AddressLike,
    allowanceAmount: BigNumberish,
    resetTime: BigNumberish,
  ];
  export type OutputTuple = [
    safe: string,
    delegate: string,
    token: string,
    allowanceAmount: bigint,
    resetTime: bigint,
  ];
  export interface OutputObject {
    safe: string;
    delegate: string;
    token: string;
    allowanceAmount: bigint;
    resetTime: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface AllowanceModule extends BaseContract {
  connect(runner?: ContractRunner | null): AllowanceModule;
  waitForDeployment(): Promise<this>;

  interface: AllowanceModuleInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;

  ALLOWANCE_TRANSFER_TYPEHASH: TypedContractMethod<[], [string], 'view'>;

  DOMAIN_SEPARATOR_TYPEHASH: TypedContractMethod<[], [string], 'view'>;

  NAME: TypedContractMethod<[], [string], 'view'>;

  VERSION: TypedContractMethod<[], [string], 'view'>;

  allowances: TypedContractMethod<
    [arg0: AddressLike, arg1: AddressLike, arg2: AddressLike],
    [
      [bigint, bigint, bigint, bigint, bigint] & {
        amount: bigint;
        spent: bigint;
        resetTimeMin: bigint;
        lastResetMin: bigint;
        nonce: bigint;
      },
    ],
    'view'
  >;

  delegates: TypedContractMethod<
    [arg0: AddressLike, arg1: BigNumberish],
    [
      [string, bigint, bigint] & {
        delegate: string;
        prev: bigint;
        next: bigint;
      },
    ],
    'view'
  >;

  delegatesStart: TypedContractMethod<[arg0: AddressLike], [bigint], 'view'>;

  tokens: TypedContractMethod<
    [arg0: AddressLike, arg1: AddressLike, arg2: BigNumberish],
    [string],
    'view'
  >;

  setAllowance: TypedContractMethod<
    [
      delegate: AddressLike,
      token: AddressLike,
      allowanceAmount: BigNumberish,
      resetTimeMin: BigNumberish,
      resetBaseMin: BigNumberish,
    ],
    [void],
    'nonpayable'
  >;

  resetAllowance: TypedContractMethod<
    [delegate: AddressLike, token: AddressLike],
    [void],
    'nonpayable'
  >;

  deleteAllowance: TypedContractMethod<
    [delegate: AddressLike, token: AddressLike],
    [void],
    'nonpayable'
  >;

  executeAllowanceTransfer: TypedContractMethod<
    [
      safe: AddressLike,
      token: AddressLike,
      to: AddressLike,
      amount: BigNumberish,
      paymentToken: AddressLike,
      payment: BigNumberish,
      delegate: AddressLike,
      signature: BytesLike,
    ],
    [void],
    'nonpayable'
  >;

  getChainId: TypedContractMethod<[], [bigint], 'view'>;

  generateTransferHash: TypedContractMethod<
    [
      safe: AddressLike,
      token: AddressLike,
      to: AddressLike,
      amount: BigNumberish,
      paymentToken: AddressLike,
      payment: BigNumberish,
      nonce: BigNumberish,
    ],
    [string],
    'view'
  >;

  getTokens: TypedContractMethod<[safe: AddressLike, delegate: AddressLike], [string[]], 'view'>;

  getTokenAllowance: TypedContractMethod<
    [safe: AddressLike, delegate: AddressLike, token: AddressLike],
    [[bigint, bigint, bigint, bigint, bigint]],
    'view'
  >;

  addDelegate: TypedContractMethod<[delegate: AddressLike], [void], 'nonpayable'>;

  removeDelegate: TypedContractMethod<
    [delegate: AddressLike, removeAllowances: boolean],
    [void],
    'nonpayable'
  >;

  getDelegates: TypedContractMethod<
    [safe: AddressLike, start: BigNumberish, pageSize: BigNumberish],
    [[string[], bigint] & { results: string[]; next: bigint }],
    'view'
  >;

  getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;

  getFunction(
    nameOrSignature: 'ALLOWANCE_TRANSFER_TYPEHASH'
  ): TypedContractMethod<[], [string], 'view'>;
  getFunction(
    nameOrSignature: 'DOMAIN_SEPARATOR_TYPEHASH'
  ): TypedContractMethod<[], [string], 'view'>;
  getFunction(nameOrSignature: 'NAME'): TypedContractMethod<[], [string], 'view'>;
  getFunction(nameOrSignature: 'VERSION'): TypedContractMethod<[], [string], 'view'>;
  getFunction(nameOrSignature: 'allowances'): TypedContractMethod<
    [arg0: AddressLike, arg1: AddressLike, arg2: AddressLike],
    [
      [bigint, bigint, bigint, bigint, bigint] & {
        amount: bigint;
        spent: bigint;
        resetTimeMin: bigint;
        lastResetMin: bigint;
        nonce: bigint;
      },
    ],
    'view'
  >;
  getFunction(nameOrSignature: 'delegates'): TypedContractMethod<
    [arg0: AddressLike, arg1: BigNumberish],
    [
      [string, bigint, bigint] & {
        delegate: string;
        prev: bigint;
        next: bigint;
      },
    ],
    'view'
  >;
  getFunction(
    nameOrSignature: 'delegatesStart'
  ): TypedContractMethod<[arg0: AddressLike], [bigint], 'view'>;
  getFunction(
    nameOrSignature: 'tokens'
  ): TypedContractMethod<
    [arg0: AddressLike, arg1: AddressLike, arg2: BigNumberish],
    [string],
    'view'
  >;
  getFunction(
    nameOrSignature: 'setAllowance'
  ): TypedContractMethod<
    [
      delegate: AddressLike,
      token: AddressLike,
      allowanceAmount: BigNumberish,
      resetTimeMin: BigNumberish,
      resetBaseMin: BigNumberish,
    ],
    [void],
    'nonpayable'
  >;
  getFunction(
    nameOrSignature: 'resetAllowance'
  ): TypedContractMethod<[delegate: AddressLike, token: AddressLike], [void], 'nonpayable'>;
  getFunction(
    nameOrSignature: 'deleteAllowance'
  ): TypedContractMethod<[delegate: AddressLike, token: AddressLike], [void], 'nonpayable'>;
  getFunction(
    nameOrSignature: 'executeAllowanceTransfer'
  ): TypedContractMethod<
    [
      safe: AddressLike,
      token: AddressLike,
      to: AddressLike,
      amount: BigNumberish,
      paymentToken: AddressLike,
      payment: BigNumberish,
      delegate: AddressLike,
      signature: BytesLike,
    ],
    [void],
    'nonpayable'
  >;
  getFunction(nameOrSignature: 'getChainId'): TypedContractMethod<[], [bigint], 'view'>;
  getFunction(
    nameOrSignature: 'generateTransferHash'
  ): TypedContractMethod<
    [
      safe: AddressLike,
      token: AddressLike,
      to: AddressLike,
      amount: BigNumberish,
      paymentToken: AddressLike,
      payment: BigNumberish,
      nonce: BigNumberish,
    ],
    [string],
    'view'
  >;
  getFunction(
    nameOrSignature: 'getTokens'
  ): TypedContractMethod<[safe: AddressLike, delegate: AddressLike], [string[]], 'view'>;
  getFunction(
    nameOrSignature: 'getTokenAllowance'
  ): TypedContractMethod<
    [safe: AddressLike, delegate: AddressLike, token: AddressLike],
    [[bigint, bigint, bigint, bigint, bigint]],
    'view'
  >;
  getFunction(
    nameOrSignature: 'addDelegate'
  ): TypedContractMethod<[delegate: AddressLike], [void], 'nonpayable'>;
  getFunction(
    nameOrSignature: 'removeDelegate'
  ): TypedContractMethod<[delegate: AddressLike, removeAllowances: boolean], [void], 'nonpayable'>;
  getFunction(
    nameOrSignature: 'getDelegates'
  ): TypedContractMethod<
    [safe: AddressLike, start: BigNumberish, pageSize: BigNumberish],
    [[string[], bigint] & { results: string[]; next: bigint }],
    'view'
  >;

  getEvent(
    key: 'AddDelegate'
  ): TypedContractEvent<
    AddDelegateEvent.InputTuple,
    AddDelegateEvent.OutputTuple,
    AddDelegateEvent.OutputObject
  >;
  getEvent(
    key: 'DeleteAllowance'
  ): TypedContractEvent<
    DeleteAllowanceEvent.InputTuple,
    DeleteAllowanceEvent.OutputTuple,
    DeleteAllowanceEvent.OutputObject
  >;
  getEvent(
    key: 'ExecuteAllowanceTransfer'
  ): TypedContractEvent<
    ExecuteAllowanceTransferEvent.InputTuple,
    ExecuteAllowanceTransferEvent.OutputTuple,
    ExecuteAllowanceTransferEvent.OutputObject
  >;
  getEvent(
    key: 'PayAllowanceTransfer'
  ): TypedContractEvent<
    PayAllowanceTransferEvent.InputTuple,
    PayAllowanceTransferEvent.OutputTuple,
    PayAllowanceTransferEvent.OutputObject
  >;
  getEvent(
    key: 'RemoveDelegate'
  ): TypedContractEvent<
    RemoveDelegateEvent.InputTuple,
    RemoveDelegateEvent.OutputTuple,
    RemoveDelegateEvent.OutputObject
  >;
  getEvent(
    key: 'ResetAllowance'
  ): TypedContractEvent<
    ResetAllowanceEvent.InputTuple,
    ResetAllowanceEvent.OutputTuple,
    ResetAllowanceEvent.OutputObject
  >;
  getEvent(
    key: 'SetAllowance'
  ): TypedContractEvent<
    SetAllowanceEvent.InputTuple,
    SetAllowanceEvent.OutputTuple,
    SetAllowanceEvent.OutputObject
  >;

  filters: {
    'AddDelegate(address,address)': TypedContractEvent<
      AddDelegateEvent.InputTuple,
      AddDelegateEvent.OutputTuple,
      AddDelegateEvent.OutputObject
    >;
    AddDelegate: TypedContractEvent<
      AddDelegateEvent.InputTuple,
      AddDelegateEvent.OutputTuple,
      AddDelegateEvent.OutputObject
    >;

    'DeleteAllowance(address,address,address)': TypedContractEvent<
      DeleteAllowanceEvent.InputTuple,
      DeleteAllowanceEvent.OutputTuple,
      DeleteAllowanceEvent.OutputObject
    >;
    DeleteAllowance: TypedContractEvent<
      DeleteAllowanceEvent.InputTuple,
      DeleteAllowanceEvent.OutputTuple,
      DeleteAllowanceEvent.OutputObject
    >;

    'ExecuteAllowanceTransfer(address,address,address,address,uint96,uint16)': TypedContractEvent<
      ExecuteAllowanceTransferEvent.InputTuple,
      ExecuteAllowanceTransferEvent.OutputTuple,
      ExecuteAllowanceTransferEvent.OutputObject
    >;
    ExecuteAllowanceTransfer: TypedContractEvent<
      ExecuteAllowanceTransferEvent.InputTuple,
      ExecuteAllowanceTransferEvent.OutputTuple,
      ExecuteAllowanceTransferEvent.OutputObject
    >;

    'PayAllowanceTransfer(address,address,address,address,uint96)': TypedContractEvent<
      PayAllowanceTransferEvent.InputTuple,
      PayAllowanceTransferEvent.OutputTuple,
      PayAllowanceTransferEvent.OutputObject
    >;
    PayAllowanceTransfer: TypedContractEvent<
      PayAllowanceTransferEvent.InputTuple,
      PayAllowanceTransferEvent.OutputTuple,
      PayAllowanceTransferEvent.OutputObject
    >;

    'RemoveDelegate(address,address)': TypedContractEvent<
      RemoveDelegateEvent.InputTuple,
      RemoveDelegateEvent.OutputTuple,
      RemoveDelegateEvent.OutputObject
    >;
    RemoveDelegate: TypedContractEvent<
      RemoveDelegateEvent.InputTuple,
      RemoveDelegateEvent.OutputTuple,
      RemoveDelegateEvent.OutputObject
    >;

    'ResetAllowance(address,address,address)': TypedContractEvent<
      ResetAllowanceEvent.InputTuple,
      ResetAllowanceEvent.OutputTuple,
      ResetAllowanceEvent.OutputObject
    >;
    ResetAllowance: TypedContractEvent<
      ResetAllowanceEvent.InputTuple,
      ResetAllowanceEvent.OutputTuple,
      ResetAllowanceEvent.OutputObject
    >;

    'SetAllowance(address,address,address,uint96,uint16)': TypedContractEvent<
      SetAllowanceEvent.InputTuple,
      SetAllowanceEvent.OutputTuple,
      SetAllowanceEvent.OutputObject
    >;
    SetAllowance: TypedContractEvent<
      SetAllowanceEvent.InputTuple,
      SetAllowanceEvent.OutputTuple,
      SetAllowanceEvent.OutputObject
    >;
  };
}
