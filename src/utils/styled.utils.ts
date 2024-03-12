export const withTransientProps = {
  shouldForwardProp: (propName: string) => !propName.startsWith('$') && propName !== 'ownerState',
};
