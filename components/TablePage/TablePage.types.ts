import { type RJSFSchema, type UiSchema } from '@rjsf/utils';
import { MRT_RowData, MRT_SortingState, type MRT_ColumnDef } from 'material-react-table';

import { type FetchService } from '@/types/api';

export interface TablePageProps<T extends MRT_RowData> {
  actionConfig: TableActionConfig<T>;
  columns: MRT_ColumnDef<T>[];
  defaultSorting?: MRT_SortingState;
  tableService: FetchService;
}

export interface ActionConfig<T> {
  title?: string;
  formType: 'action';
  submitService: (data: any) => Promise<any>;
}

export interface DialogConfig<T> {
  title?: string;
  formType: 'dialog';
  initService?: (data: any) => Promise<any>;
  submitService: (data: any) => Promise<any>;
  schema: RJSFSchema;
  uiSchema: UiSchema<T>;
}

export interface PageConfig<T> {
  title?: string;
  formType: 'page';
  url: string;
  params: string[];
}

export type TableActionConfig<T> = { [key: string]: ActionConfig<T> | PageConfig<T> | DialogConfig<T> };
