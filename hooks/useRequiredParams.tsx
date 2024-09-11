import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Alert } from '@mui/material';

interface UseRequiredParamsProps<T> {
  requiredParams: string[];
  row?: T;
}

const useRequiredParams = <T extends Record<string, unknown>>({
  requiredParams,
  row = {} as T,
}: UseRequiredParamsProps<T>) => {
  const [missingParams, setMissingParams] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();

  const requiredParamsMap: Record<string, string | null> = useMemo(
    () =>
      requiredParams.reduce((acc, param) => {
        const paramValue = Object.keys(row).length ? row[param] : searchParams.get(param);
        return { ...acc, [param]: paramValue };
      }, {}),
    [searchParamsString, row, requiredParams]
  );

  useEffect(() => {
    const missingParams = requiredParams.filter((param) => !requiredParamsMap[param]);
    setMissingParams(missingParams);
  }, [requiredParamsMap, requiredParams]);

  const missingParamsAlert = missingParams.length && (
    <Alert severity="error">Missing required parameters: {missingParams.join(', ')}</Alert>
  );

  return { requiredParamsMap, hasMissingParams: missingParams.length > 0, missingParamsAlert };
};

export default useRequiredParams;
