import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';

const useDeleteMutation = (actionConfig, refetch) => {
  const { enqueueSnackbar } = useSnackbar();

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return actionConfig?.delete?.submitService && (await actionConfig.delete.submitService(id));
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
      return actionConfig?.bulkDelete?.submitService && (await actionConfig.bulkDelete.submitService(ids));
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

export default useDeleteMutation;
