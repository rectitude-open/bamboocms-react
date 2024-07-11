'use client';

import React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

export default function Page(): React.ReactElement {
  const { isPending, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: () => fetch('http://localhost:31111/api/admin/administrator-roles').then((res) => res.json()),
  });

  if (isPending) {
    return 'Loading...';
  }

  if (error) return 'An error has occurred: ' + error.message;

  console.log('data', data);

  return (
    <div>
      {data.data.map((item) => {
        return <>{item.name}</>;
      })}
    </div>
  );
}
