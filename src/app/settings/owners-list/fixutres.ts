import routes from '@/app/routes';

export const settingsMenu = [
  { id: 1, title: 'Owners', url: routes.settingsOwnersList },
  { id: 2, title: 'Environment variables', url: routes.settingsEnvironmentVariables },
];
