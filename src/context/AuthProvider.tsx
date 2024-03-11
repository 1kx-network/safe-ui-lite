'use client';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // const { isConnecting, isConnected } = useAccount();

  // const router = useRouter();

  // useEffect(() => {
  //   if (!isConnected && !isConnected) {
  //     router.push(routes.home);
  //     return;
  //   }
  // }, [isConnected, isConnecting, router]);

  return children;
}
