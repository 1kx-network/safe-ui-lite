'use client';
/* import { FC, useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import WalletConnectUi from '@/features/walletconnect/components';
import { WalletInput } from '@/ui-kit';

import {
  PopupWrapper,
  MainContainer,
  Title,
  ConnectionStringWrapper,
  HR,
  PasteWrapper,
  ContainedButton,
  Connections,
  NoConnections,
  Overlay,
  PasteDescription,
} from './wallet-connect-popup.styles';

interface IInputsForm {
  wcString: string;
}
export const WCSchema = yup.object().shape({
  wcString: yup.string().required('This field is required'),
});

interface WalletConnectPopupProps {
  isOpen: boolean;
  toggle: () => void;
}

export const WalletConnectPopup: FC<WalletConnectPopupProps> = ({ isOpen, toggle }) => {
  const {
    wcConnect: wcConnectV2,
    wcClientData: wcSessionV2,
    wcDisconnect: wcDisconnectV2,
    isWallectConnectInitialized,
    error,
  } = useWalletConnectV2();

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
  } = useForm<IInputsForm>({
    mode: 'onSubmit',
    resolver: yupResolver(WCSchema),
    defaultValues: {
      wcString: '',
    },
  });

  const connectDapp = async (uri: string) => {
    const res = await wcConnectV2(uri);
    console.log('response from connect', res);
  };

  useEffect(() => {
    console.log(`wcSessionV2`, wcSessionV2);
  }, [wcSessionV2]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: React.ChangeEvent<HTMLInputElement>) => void
  ) => {
    const regex = /^wc:(.*)relay-protocol=(.*)&symKey=(.*)$/;
    const value = event.target.value;
    if (regex.test(value)) {
      connectDapp(value);
    }
    onChange(event);
  };

  const handleClickPaste = async () => {
    const value = await window.navigator.clipboard.readText();
    setValue('wcString', value);
  };

  const onSubmit: SubmitHandler<IInputsForm> = async (data: IInputsForm) => {
    console.log(data);
  };

  if (!isOpen) return null;
  return (
    <>
      <Overlay onClick={toggle} />
      <WalletConnectUi />
      <PopupWrapper>
        <MainContainer>
          <div>
            <svg
              style={{ display: 'inline-block', width: '50px' }}
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium styles_icon__O4UEn mui-style-10dohqv"
              focusable="false"
              aria-hidden="true"
            >
              <path
                style={{
                  fontSize: '50px',
                  color: '#3a99fb',
                }}
                d="M6.09442 8.34459C9.35599 5.21847 14.644 5.21847 17.9056 8.34459L18.2981 8.72082C18.4612 8.87713 18.4612 9.13055 18.2981 9.28686L16.9554 10.5739C16.8738 10.652 16.7416 10.652 16.6601 10.5739L16.1199 10.0561C13.8445 7.87528 10.1555 7.87528 7.88012 10.0561L7.30164 10.6106C7.2201 10.6887 7.0879 10.6887 7.00636 10.6106L5.66357 9.32358C5.50049 9.16727 5.50049 8.91385 5.66357 8.75754L6.09442 8.34459ZM20.6826 11.0063L21.8777 12.1517C22.0408 12.308 22.0408 12.5615 21.8777 12.7178L16.489 17.8828C16.3259 18.0391 16.0615 18.0391 15.8984 17.8828C15.8984 17.8828 15.8984 17.8828 15.8984 17.8828L12.0739 14.217C12.0331 14.1779 11.967 14.1779 11.9262 14.217C11.9262 14.217 11.9262 14.217 11.9262 14.217L8.10172 17.8828C7.93865 18.0391 7.67424 18.0391 7.51116 17.8828C7.51116 17.8828 7.51117 17.8828 7.51116 17.8828L2.12231 12.7177C1.95923 12.5614 1.95923 12.308 2.12231 12.1517L3.31739 11.0062C3.48047 10.8499 3.74487 10.8499 3.90795 11.0062L7.73258 14.672C7.77335 14.7111 7.83945 14.7111 7.88022 14.672C7.88022 14.672 7.88022 14.672 7.88022 14.672L11.7047 11.0062C11.8677 10.8499 12.1321 10.8499 12.2952 11.0062C12.2952 11.0062 12.2952 11.0062 12.2952 11.0062L16.1198 14.672C16.1606 14.7111 16.2267 14.7111 16.2675 14.672L20.0921 11.0063C20.2551 10.85 20.5195 10.85 20.6826 11.0063Z"
                fill="currentColor"
              ></path>
            </svg>
          </div>
          <Title>{`Connect dApps to Account`}</Title>
          <PasteDescription>
            {`Paste the pairing code below to connect to your Safe Account via WalletConnect`}
          </PasteDescription>
          <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: '24px' }}>
            <ConnectionStringWrapper spellCheck="false">
              <Controller
                control={control}
                name="wcString"
                render={({ field }) => (
                  <WalletInput
                    {...field}
                    error={!!errors.wcString}
                    errorValue={errors.wcString?.message}
                    placeholder="wc:"
                    onChange={e => handleChange(e, field.onChange)}
                  />
                )}
              />
              <PasteWrapper>
                <ContainedButton onClick={handleClickPaste}>Paste</ContainedButton>
              </PasteWrapper>
            </ConnectionStringWrapper>
          </form>
        </MainContainer>
        <HR />
        <Connections>
          <NoConnections>No dApps are connected yet.</NoConnections>
        </Connections>
      </PopupWrapper>
    </>
  );
}; */
