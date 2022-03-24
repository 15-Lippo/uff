import { Token } from 'services/observables/tokens';
import { ropstenImage } from 'services/web3/config';

export const mockToken: Token = {
  address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  logoURI: ropstenImage,
  name: 'Ethereum',
  chainId: 1,
  balance: '1.085561228177686039',
  symbol: 'TKN1',
  decimals: 18,
  usdPrice: '3138.970276',
  liquidity: '142917205.826758',
  usd_24h_ago: '3096.083312',
  price_change_24: 1.39,
  price_history_7d: [],
  usd_volume_24: '5627813.477706',
  isProtected: true,
};
