'use client';

import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

const ReactQueryProvider = ({ children }: React.PropsWithChildren) => {
  const router = useRouter();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false
      }
    },
    queryCache: new QueryCache({
      onError: (e) => {
        const err = e as unknown as AxiosError;
        if (err.response?.status === 401) {
          router.push('/signIn');
        }
      }
    })
  });

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;