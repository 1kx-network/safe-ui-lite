import utils from 'ethers';

import { BatchFile } from '../typings/models';

export const stringifyReplacer = (_: string, value: any) => (value === undefined ? null : value);

const serializeJSONObject = (json: any): string => {
  if (Array.isArray(json)) {
    return `[${json.map(el => serializeJSONObject(el)).join(',')}]`;
  }

  if (typeof json === 'object' && json !== null) {
    let acc = '';
    const keys = Object.keys(json).sort();
    acc += `{${JSON.stringify(keys, stringifyReplacer)}`;

    for (let i = 0; i < keys.length; i++) {
      acc += `${serializeJSONObject(json[keys[i]])},`;
    }

    return `${acc}}`;
  }

  return `${JSON.stringify(json, stringifyReplacer)}`;
};

const calculateChecksum = (batchFile: BatchFile): string | undefined => {
  const serialized = serializeJSONObject({
    ...batchFile,
    meta: { ...batchFile.meta, name: null },
  });

  const sha = utils.keccak256(utils.toUtf8Bytes(serialized));

  return sha || undefined;
};

export const addChecksum = (batchFile: BatchFile): BatchFile => {
  return {
    ...batchFile,
    meta: {
      ...batchFile.meta,
      checksum: calculateChecksum(batchFile),
    },
  };
};

export const validateChecksum = (batchFile: BatchFile): boolean => {
  const targetObj = { ...batchFile };
  const checksum = targetObj.meta.checksum;
  delete targetObj.meta.checksum;

  return calculateChecksum(targetObj) === checksum;
};
