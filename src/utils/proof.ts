import { ethers } from 'ethers';

/* eslint-disable @typescript-eslint/no-explicit-any */
export function padArray(arr: any[], length: number, fill: any = 0): any[] {
  return arr.concat(Array(Math.max(length - arr.length, 0)).fill(fill));
}
/* eslint-enable @typescript-eslint/no-explicit-any */
export function extractCoordinates(serializedPubKey: string): {
  x: number[];
  y: number[];
} {
  // Ensure the key starts with '0x04' which is typical for an uncompressed key.
  if (!serializedPubKey.startsWith('0x04')) {
    throw new Error('The public key does not appear to be in uncompressed format.');
  }

  // The next 64 characters after the '0x04' are the x-coordinate.
  const xHex = serializedPubKey.slice(4, 68);

  // The following 64 characters are the y-coordinate.
  const yHex = serializedPubKey.slice(68, 132);

  // Convert the hex string to a byte array.
  const xBytes = Array.from(Buffer.from(xHex, 'hex'));
  const yBytes = Array.from(Buffer.from(yHex, 'hex'));
  return { x: xBytes, y: yBytes };
}

export function addressToArray(address: string): number[] {
  if (address.length !== 42 || !address.startsWith('0x')) {
    throw new Error('Address should be a 40-character hex string starting with 0x.');
  }
  return Array.from(ethers.getBytes(address));
}

export function extractRSFromSignature(signatureHex: string): number[] {
  if (signatureHex.length !== 132 || !signatureHex.startsWith('0x')) {
    throw new Error('Signature should be a 132-character hex string starting with 0x.');
  }
  return Array.from(Buffer.from(signatureHex.slice(2, 130), 'hex'));
}
