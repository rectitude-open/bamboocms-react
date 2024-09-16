import React, { useEffect, useMemo, useState } from 'react';
import { Alert } from '@mui/material';

interface UseRequiredParamsProps<T> {
  requiredParams: string[];
  row?: T;
}

const useRequiredParams = <T extends Record<string, unknown>>({
  requiredParams = [],
  row = {} as T,
}: UseRequiredParamsProps<T>) => {
  const [missingParams, setMissingParams] = useState<string[]>([]);
  const stableRequiredParams = useMemo(() => requiredParams, [requiredParams.join(',')]);
  const stableRow = useMemo(() => row, [JSON.stringify(row)]);

  const requiredParamsMap: Record<string, string | null> = useMemo(
    () =>
      stableRequiredParams.reduce((acc, param) => {
        const paramValue = stableRow[param] ?? null;
        return { ...acc, [param]: paramValue };
      }, {}),
    [stableRow, stableRequiredParams]
  );

  useEffect(() => {
    const missingParams = stableRequiredParams.filter((param) => !requiredParamsMap[param]);
    setMissingParams(missingParams);
  }, [requiredParamsMap, stableRequiredParams]);

  const missingParamsAlert = missingParams.length && (
    <Alert severity="error">Missing required parameters: {missingParams.join(', ')}</Alert>
  );

  return { requiredParamsMap, hasMissingParams: missingParams.length > 0, missingParamsAlert };
};

export default useRequiredParams;
