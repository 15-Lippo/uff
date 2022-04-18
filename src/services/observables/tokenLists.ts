import { utils } from 'ethers';
import { ethToken, wethToken } from 'services/web3/config';
import { uniqBy } from 'lodash';
import { BehaviorSubject, combineLatest, from } from 'rxjs';
import { mapIgnoreThrown } from 'utils/pureFunctions';
import axios from 'axios';
import { shareReplay } from 'rxjs/operators';
import { switchMapIgnoreThrow } from 'services/observables/customOperators';
import { TokenList, TokenMinimal } from 'services/observables/tokens';
import { getTokenListMock } from 'services/api/mockV3Welcome';

const buildTokenListTokens = (
  tokenLists: TokenList[],
  userPreferredListIds?: string[]
): TokenMinimal[] => {
  const tokenListTokensMerged: TokenMinimal[] = tokenLists
    .filter((list) =>
      userPreferredListIds
        ? userPreferredListIds.some((id) => id === list.name)
        : true
    )
    .flatMap((list) => list.tokens)
    .filter((token) => !!token.address)
    .map((token) => ({
      ...token,
      address: utils.getAddress(token.address),
    }));

  tokenListTokensMerged.push(
    {
      symbol: 'ETH',
      address: ethToken,
      logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg',
      decimals: 18,
      name: 'Ethereum',
    },
    {
      symbol: 'WETH',
      address: wethToken,
      logoURI: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg',
      decimals: 18,
      name: 'Wrapped Ethereum',
    }
  );

  return uniqBy(tokenListTokensMerged, (x) => x.address);
};

export const getLogoByURI = (uri: string | undefined) =>
  uri && uri.startsWith('ipfs') ? buildIpfsUri(uri.split('//')[1]) : uri;

const buildIpfsUri = (ipfsHash: string) => `https://ipfs.io/ipfs/${ipfsHash}`;

export const listOfLists = [
  {
    uri: 'https://tokens.1inch.eth.link',
    name: '1inch',
  },
  {
    uri: 'https://tokens.coingecko.com/ethereum/all.json',
    name: 'CoinGecko',
  },
  {
    uri: 'https://tokenlist.zerion.eth.link',
    name: 'Zerion',
  },
  {
    uri: 'https://zapper.fi/api/token-list',
    name: 'Zapper Token List',
  },
  {
    uri: 'https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json',
    name: 'Compound',
  },
  {
    uri: 'https://yearn.science/static/tokenlist.json',
    name: 'Yearn',
  },
  {
    uri: 'https://uniswap.mycryptoapi.com',
    name: 'MyCrypto Token List',
  },
  {
    uri: 'https://tokenlist.aave.eth.link',
    name: 'Aave Token List',
  },
  {
    uri: 'https://defiprime.com/defiprime.tokenlist.json',
    name: 'Defiprime',
  },
];

export const userPreferredListIds$ = new BehaviorSubject<string[]>([]);

export const tokenListsNew$ = from(
  mapIgnoreThrown(listOfLists, async (list) => {
    const res = await axios.get<TokenList>(list.uri, { timeout: 10000 });
    return {
      ...res.data,
      logoURI: getLogoByURI(res.data.logoURI),
    };
  })
).pipe(shareReplay(1));

export const tokenListTokens$ = combineLatest([
  tokenListsNew$,
  userPreferredListIds$,
]).pipe(
  switchMapIgnoreThrow(async ([tokenLists, userPreferredListIds]) => {
    const allTokenListTokens: TokenMinimal[] = buildTokenListTokens(tokenLists);
    const userPreferredTokenListTokens: TokenMinimal[] = buildTokenListTokens(
      tokenLists,
      userPreferredListIds
    );

    return { allTokenListTokens, userPreferredTokenListTokens };
  }),
  shareReplay(1)
);
