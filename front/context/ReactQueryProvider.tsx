'use client';

import { Hydrate, QueryClient, QueryClientProvider, dehydrate } from '@tanstack/react-query';

const ReactQueryProvider = ({ children }: React.PropsWithChildren) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false
      }
    }
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={dehydratedState}>
        {children}
      </Hydrate>
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;