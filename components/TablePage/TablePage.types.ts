import { MRT_SortingState, type MRT_ColumnDef } from 'material-react-table';

import { type FetchFunction, type UpdateFunction } from '@/types/api';

export interface TablePageProps {
  services: {
    fetch: FetchFunction;
    update: UpdateFunction;
  };
  columns: MRT_ColumnDef<Record<string, unknown>>[];
  defaultSorting?: MRT_SortingState;
}
