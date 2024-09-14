import { useMutation } from '@tanstack/react-query';
import _ from 'lodash';
import { useSnackbar } from 'notistack';

import { ActionConfig, TableActionConfig } from '../TablePage.types';

const useRequests = <T,>(actionConfig: TableActionConfig<T>, refetch: any) => {
  const { enqueueSnackbar } = useSnackbar();
  const config = _.cloneDeep(actionConfig) as { [key: string]: ActionConfig<T> };

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      if (config.delete?.services?.submitService) {
        return await config.delete.services.submitService(id);
      }
    },
    onSuccess: (data) => {
      enqueueSnackbar(data?.message ?? 'Delete successfully!', { variant: 'success' });
      refetch();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      if (config.bulkDelete?.services?.submitService) {
        return await config.bulkDelete.services.submitService(ids);
      }
    },
    onSuccess: (data) => {
      enqueueSnackbar(data?.message ?? 'Bulk Delete successfully!', { variant: 'success' });
      refetch();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return { deleteMutation, bulkDeleteMutation };
};

export default useRequests;
