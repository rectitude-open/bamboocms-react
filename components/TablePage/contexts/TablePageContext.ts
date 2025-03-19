import { type MRT_TableInstance, type MRT_RowData } from 'material-react-table';
import { createContext, useContext } from 'react';

export interface TablePageContextProps<T extends MRT_RowData> {
  table: MRT_TableInstance<T>;
  refetch: () => void;
  isLoading: boolean;
  isRefetching: boolean;
  pagination: { pageIndex: number; pageSize: number };
  data: T[];
}

const defaultContext: TablePageContextProps<any> = {
  table: {} as MRT_TableInstance<any>,
  refetch: () => {},
  isLoading: false,
  isRefetching: false,
  pagination: { pageIndex: 0, pageSize: 10 },
  data: [],
};

export const TablePageContext = createContext<TablePageContextProps<any>>(defaultContext);

export function useTablePage<T extends MRT_RowData>(): TablePageContextProps<T> {
  return useContext<TablePageContextProps<T>>(TablePageContext);
}
