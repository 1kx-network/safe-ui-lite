import { TransactionBuilder } from './trx-builder.styles';

interface TrxBuilderProps {}

const TRX_BUILDER_URL = 'https://apps-portal.safe.global/tx-builder/'; // 'https://safe-apps.dev.5afe.dev/tx-builder';
export const TrxBuilder = ({}: TrxBuilderProps) => {
  return (
    <TransactionBuilder
      id="iframe-https://apps-portal.safe.global/tx-builder"
      src={TRX_BUILDER_URL}
      title="Transaction Builder"
      sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms allow-downloads allow-orientation-lock"
      allow=""
    ></TransactionBuilder>
  );
};
