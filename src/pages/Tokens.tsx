import { TopTokens } from 'elements/tokens/TopTokens';
import { TokenTable } from 'elements/tokens/TokenTable';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadTokenData } from 'services/observables/triggers';

export const Tokens = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    loadTokenData(dispatch);
  }, [dispatch]);

  return (
    <div className="space-y-30">
      <TopTokens />
      <TokenTable />
    </div>
  );
};
