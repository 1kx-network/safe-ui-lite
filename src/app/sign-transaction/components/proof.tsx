import React, { useCallback, useState } from 'react';
import { ethers } from 'ethers';
import { Noir, ProofData } from '@noir-lang/noir_js';
import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { usePublicClient } from 'wagmi';
import { encodeFunctionData, toHex } from 'viem';
import EthSafeTransaction from '@safe-global/protocol-kit/dist/src/utils/transactions/SafeTransaction';

import circuit from '../../../constants/circut.json'; // Adjust the path as necessary
import {
  addressToArray,
  extractCoordinates,
  extractRSFromSignature,
  padArray,
} from '../../../utils/proof';
import { customToasty } from '../../../components';
import { WalletButton } from '../../../ui-kit';
import { styledBtn } from '../sing-transaction.styles';
import { SEPOLIA_ZK_MODULE } from '../../../constants/addresses';
import abi from '../../../app/contracts/abi/zkSafeModule.json';

import { WrapperStyled } from './proof.styles';

interface IproofComponent {
  threshold: number;
  owners: string[];
  signatures: string[];
  txHash: string;
  transaction: EthSafeTransaction;
  safeAddress: string;
}

export default function Proof({
  threshold,
  owners,
  signatures,
  txHash,
  transaction,
  safeAddress,
}: IproofComponent) {
  const [proofState, setProofState] = useState<ProofData>();
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  const client = usePublicClient();
  const [proofVerified, setProofVerified] = useState(false);

  const proof = useCallback(async () => {
    setIsGeneratingProof(true);
    try {
      // @ts-expect-error: BarretenbergBackend constructor is not typed
      const backend = new BarretenbergBackend(circuit);
      // @ts-expect-error: Noir constructor is not typed
      const noir = new Noir(circuit, backend);
      await noir.init();

      const nil_pubkey = {
        x: Array.from(
          ethers.getBytes('0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798')
        ),
        y: Array.from(
          ethers.getBytes('0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8')
        ),
      };

      const nil_signature = Array.from(
        ethers.getBytes(
          '0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8'
        )
      );

      const zero_address = new Array(20).fill(0);
      const sigis = signatures.map(sig => sig.trim());
      sigis.sort((sig1, sig2) =>
        ethers.recoverAddress(txHash, sig1).localeCompare(ethers.recoverAddress(txHash, sig2))
      );
      const owners_ = owners.map((owner: string) => owner.trim());

      const input = {
        threshold: threshold, // Set the threshold as necessary
        signers: padArray(
          signatures.map(sig =>
            extractCoordinates(ethers.SigningKey.recoverPublicKey(txHash, sig))
          ),
          10,
          nil_pubkey
        ),
        signatures: padArray(sigis.map(extractRSFromSignature), 10, nil_signature),
        txn_hash: Array.from(ethers.getBytes(txHash)),
        owners: padArray(owners_.map(addressToArray), 10, zero_address),
      };

      const correctProof = await noir.generateFinalProof(input);
      setProofState(correctProof);
      customToasty('Proof generation done', 'success');
      const verification = await noir.verifyFinalProof(correctProof);
      console.log('verification via NOIR', verification);
    } catch (e) {
      console.error(e);
      customToasty('Error while creating proof', 'error');
    } finally {
      setIsGeneratingProof(false);
    }
  }, [threshold, owners, signatures, txHash]);

  let buttonText = 'Generate Proof';

  if (isGeneratingProof) {
    buttonText = 'Generating Proof...';
  }

  if (!!proofState) {
    buttonText = '🎉 Proof Generated 🎉';
  }

  const verifyProof = async () => {
    setProofVerified(false);
    if (!safeAddress || !proofState || !client) return customToasty('Invalid proof', 'error');
    const args = [safeAddress, txHash, toHex(proofState?.proof)];

    try {
      const result = await client.readContract({
        address: SEPOLIA_ZK_MODULE,
        functionName: 'verifyZkSafeTransaction',
        args,
        abi,
      });
      if (!result) return customToasty('Invalid proof', 'error');
      customToasty('Proof verified', 'success');
      setProofVerified(true);
    } catch (e) {
      console.error(e);
      customToasty('Error while verifying proof', 'error');
    }
  };

  const copy = () => {
    if (!proofState) return;
    const callData = encodeFunctionData({
      abi,
      functionName: 'sendZkSafeTransaction',
      args: [
        safeAddress,
        {
          to: transaction['data']['to'],
          value: BigInt(transaction['data']['value']),
          data: transaction['data']['data'],
          operation: transaction['data']['operation'],
        },
        toHex(proofState.proof),
      ],
    });
    navigator.clipboard
      .writeText(callData)
      .then(() => {
        console.log('Call data copied to clipboard');
        customToasty('Call data copied to clipboard', 'success');
      })
      .catch(err => {
        console.error('Failed to copy call data: ', err);
        customToasty('Failed to copy call data', 'error');
      });
  };

  // Usage in your component
  return (
    <WrapperStyled>
      <WalletButton
        disabled={isGeneratingProof || !!proofState}
        variant={'outlined'}
        styles={
          !!proofState
            ? { ...styledBtn, backgroundColor: 'blue', color: 'white', cursor: 'not-allowed' }
            : styledBtn
        }
        onClick={proof}
      >
        {buttonText}
      </WalletButton>

      {!!proofState && (
        <>
          <h2>How to execute proof:</h2>
          <li>
            Step 1:{' '}
            {!proofVerified ? (
              <>
                {' '}
                <button disabled={proofVerified} onClick={verifyProof}>
                  Verify
                </button>{' '}
                the create proof on chain
              </>
            ) : (
              <> ✅ Proof is verified. </>
            )}
          </li>
          <li>
            Step 2: Go to{' '}
            <a target="_blank" href="/execute-transaction">
              {window.location.origin}/execute-transaction
            </a>
          </li>
          <li>
            Step 3: <button onClick={copy}>Copy</button> this call data and paste into
            /execute-transaction page
          </li>
        </>
      )}
    </WrapperStyled>
  );
}
