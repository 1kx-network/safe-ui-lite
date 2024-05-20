import { ContractInterface } from '@/app/new-transaction/components/tr-builder/typings/models';

import getAbi from './getAbi';

class InterfaceRepository {
  chainId: string | number;

  constructor(chainId: string | number) {
    this.chainId = chainId;
  }

  private _isMethodPayable = (m: any) => m.payable || m.stateMutability === 'payable';

  async loadAbi(address: string): Promise<string | null> {
    const abi = await getAbi(address, this.chainId);

    return abi ? JSON.stringify(abi) : null;
  }

  async abiExists(address: string): Promise<boolean> {
    const abi = await this.loadAbi(address);

    return !!abi;
  }

  getMethods(abi: string): ContractInterface {
    let parsedAbi;

    try {
      parsedAbi = JSON.parse(abi);
    } catch {
      return { methods: [] };
    }

    if (!Array.isArray(parsedAbi)) {
      return { methods: [] };
    }

    const methods = parsedAbi
      .filter((e: any) => {
        if (Object.keys(e).length === 0) {
          return false;
        }

        if (['pure', 'view'].includes(e.stateMutability)) {
          return false;
        }

        if (e.type === 'fallback' && e.stateMutability === 'nonpayable') {
          return false;
        }

        if (e?.type?.toLowerCase() === 'event') {
          return false;
        }

        return !e.constant;
      })
      .filter((m: any) => m.type !== 'constructor')
      .map((m: any) => {
        return {
          inputs: m.inputs || [],
          name: m.name || (m.type === 'fallback' ? 'fallback' : 'receive'),
          payable: this._isMethodPayable(m),
        };
      });

    return { methods };
  }
}

export type InterfaceRepo = InstanceType<typeof InterfaceRepository>;

export default InterfaceRepository;
