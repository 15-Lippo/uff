import { useQuery } from 'react-query';
import { fetchTokenBalanceMulticall } from 'services/web3/token/token';
import { useApiPoolsV3 } from 'queries/useApiPoolsV3';

export const useTokenBalances = (user?: string) => {
  const { data: pools } = useApiPoolsV3();
  const ids = pools ? pools.map((p) => p.poolDltId) : [];

  return useQuery<Map<string, string>>(
    ['v3', 'token', 'balances', user],
    () => fetchTokenBalanceMulticall(ids, user!),
    { enabled: !!user && !!pools }
  );
};
