import { TransactionBuilder } from './trx-builder.styles';

interface TrxBuilderProps {}

export const TrxBuilder = ({}: TrxBuilderProps) => {
  return (
    <TransactionBuilder
      id="iframe-https://apps-portal.safe.global/tx-builder"
      src="https://apps-portal.safe.global/tx-builder"
      title="Transaction Builder"
      sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms allow-downloads allow-orientation-lock"
      allow=""
    ></TransactionBuilder>
  );
};
