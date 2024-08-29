import { type RJSFSchema, type UiSchema } from '@rjsf/utils';
import { MRT_SortingState, type MRT_ColumnDef } from 'material-react-table';

import { ViewService, type FetchService, type UpdateService } from '@/types/api';
import { BaseEntity, UpdateEntity } from '@/types/BaseEntity';

export interface TablePageProps<T extends BaseEntity> {
  actionConfig: any;
  columns: MRT_ColumnDef<T>[];
  defaultSorting?: MRT_SortingState;
  tableService: FetchService;
}

export interface ActionConfig {
  title?: string;
  formType: 'action';
  submitService: (data: any) => Promise<any>;
}

export interface DialogConfig {
  title?: string;
  formType: 'dialog';
  initService?: (data: any) => Promise<any>;
  submitService: (data: any) => Promise<any>;
  schema: RJSFSchema;
  uiSchema: UiSchema;
}

export interface PageConfig {
  title?: string;
  formType: 'page';
  url: string;
  params: string[];
}

export type TableActionConfig = ActionConfig | PageConfig | DialogConfig;
