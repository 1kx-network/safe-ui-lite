import { WalletLayout } from '@/ui-kit';
import { WrapperStyled } from './tr-builder.styles';
import { useSearchParams } from 'next/navigation';
import { ITypeSignTrx } from '@/constants/type-sign';

const TrBuilder = () => {
  const searchParams = useSearchParams();

  const safeAddress = typeof window !== 'undefined' ? searchParams.get('address') : null;
  const chainIdUrl = searchParams.get('chainId');
  const amount = searchParams.get('amount');
  const destinationAddress = searchParams.get('destinationAddress');
  const safeTxHash = searchParams.get('safeTxHash');
  const tokenType = searchParams.get('tokenType');
  // const networkName = searchParams.get('networkName');
  const thresholdUrl = searchParams.get('thresholdUrl');
  const newThreshold = searchParams.get('newThreshold');
  const nonceUrl = searchParams.get('nonce');
  const userNetworkTrxUrl = searchParams.get('userNetworkTrx');
  const signatures = searchParams.getAll('signatures')[0];
  const signers = searchParams.getAll('signers')[0];

  const typeSignTrx: keyof ITypeSignTrx | null = searchParams.get('typeSignTrx') as
    | keyof ITypeSignTrx
    | null;

  const batch = searchParams.get('batch');

  console.log('_batch_', batch);

  return (
    <WalletLayout>
      <WrapperStyled>lorem</WrapperStyled>
    </WalletLayout>
  );
};

export default TrBuilder;
