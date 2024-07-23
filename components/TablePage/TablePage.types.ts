import { type MRT_ColumnDef } from 'material-react-table';

import { type FetchFunction } from '@/types/api';

export interface TablePageProps {
  services: {
    fetch: FetchFunction;
  };
  columns: MRT_ColumnDef<Record<string, unknown>>[];
}
