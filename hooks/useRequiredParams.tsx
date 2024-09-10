import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Alert } from '@mui/material';

const useRequiredParams = (requiredParams: string[]) => {
  const [missingParams, setMissingParams] = useState<string[]>([]);
  const searchParams = useSearchParams();

  const requiredParamsMap: Record<string, string | null> = useMemo(
    () => requiredParams.reduce((acc, param) => ({ ...acc, [param]: searchParams.get(param) }), {}),
    [searchParams]
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
