'use client';

import { Box } from '@mui/system';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import { useSearchParams } from 'next/navigation';

import { WalletTypography } from '@/ui-kit';
import { parseSearchParams } from '@/utils/helpers';
import { customToasty } from '@/components';
import IconCopy from '@/assets/svg/copy.svg';

import {
  AccordionItemButtonStyled,
  BoxTxPositionStyled,
  TransactionListItem,
  TxPositionStyled,
  WrapperStyled,
  styledItemPanel,
  styledText,
} from './tr-builder.styles';

interface FieldsValues {
  [key: string]: string | undefined;
}
interface RawTr {
  to: string;
  data: string;
  value: string;
  customData?: string;
}

interface IBatchTr {
  method: string;
  networkPrefix: string;
  rawTr: RawTr;
  fieldsValues: FieldsValues;
}

const TrBuildComponent = () => {
  const searchParams = useSearchParams();
  const batchTr = searchParams.get('batchTr');
  const parseBatchTr: IBatchTr[] = parseSearchParams(batchTr);

  if (!parseBatchTr) {
    return <div />;
  }

  const handleCopy = (value: string | undefined) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    customToasty('Was copy', 'success');
  };

  return (
    <WrapperStyled>
      {parseBatchTr.map((transaction: IBatchTr, index: number) => (
        <TransactionListItem key={index}>
          <BoxTxPositionStyled>
            <TxPositionStyled>
              <WalletTypography fontSize={14} fontWeight={600} color="#fff">
                {index + 1}
              </WalletTypography>
            </TxPositionStyled>
          </BoxTxPositionStyled>

          <Accordion allowZeroExpanded style={{ width: '90%', borderRadius: '12px' }}>
            <AccordionItem>
              <AccordionItemHeading>
                <AccordionItemButtonStyled>
                  <Box display={'flex'} gap={5}>
                    {transaction.method} {transaction.rawTr.customData ? '(Custom data)' : ''}
                  </Box>
                </AccordionItemButtonStyled>
              </AccordionItemHeading>

              <AccordionItemPanel style={styledItemPanel}>
                <Box display={'flex'} flexDirection={'column'} gap={2}>
                  {/* to */}
                  <Box display={'flex'} alignItems={'center'} gap={1.5}>
                    <WalletTypography>To: {transaction.rawTr.to}</WalletTypography>
                    <Box onClick={() => handleCopy(transaction.rawTr.to)}>
                      <IconCopy width="18px" height="18px" />
                    </Box>
                  </Box>

                  <Box display={'flex'} alignItems={'center'} gap={1.5}>
                    <WalletTypography>Network: {transaction.networkPrefix}</WalletTypography>
                  </Box>

                  {/* contract fields values */}
                  {transaction.fieldsValues &&
                    Object.entries(transaction.fieldsValues).map(([key, value]) => (
                      <Box display={'flex'} alignItems={'center'} gap={1.5} key={key}>
                        <WalletTypography>{key}:</WalletTypography>
                        <WalletTypography>{value ?? ''}</WalletTypography>
                      </Box>
                    ))}

                  {/* value */}
                  <Box display={'flex'} alignItems={'center'} gap={1.5}>
                    <WalletTypography>Value: {transaction.rawTr.value}</WalletTypography>
                  </Box>

                  {/* data */}
                  {!transaction.rawTr.customData && (
                    <Box display={'flex'} alignItems={'center'} gap={1.5}>
                      <WalletTypography style={styledText}>
                        Data: {transaction.rawTr.data}
                      </WalletTypography>
                      <Box onClick={() => handleCopy(transaction.rawTr.data)}>
                        <IconCopy width="18px" height="18px" />
                      </Box>
                    </Box>
                  )}

                  {/* custom data */}
                  {transaction.rawTr.customData && (
                    <Box display={'flex'} alignItems={'center'} gap={1.5}>
                      <WalletTypography style={styledText}>
                        Custom Data: {transaction.rawTr.customData}
                      </WalletTypography>
                      <Box onClick={() => handleCopy(transaction.rawTr.customData)}>
                        <IconCopy width="18px" height="18px" />
                      </Box>
                    </Box>
                  )}
                </Box>
              </AccordionItemPanel>
            </AccordionItem>
          </Accordion>
        </TransactionListItem>
      ))}
    </WrapperStyled>
  );
};

export default TrBuildComponent;
