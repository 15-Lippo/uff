import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { KeeprDaoToken } from 'services/api/keeperDao';
import { Token, TokenList, TokenMinimal } from 'services/observables/tokens';
import { RootState } from 'store';
import { orderBy } from 'lodash';
import { getAllTokensMap } from 'store/bancor/token';
import { utils } from 'ethers';

import { Statistic } from 'services/observables/statistics';
import { NotificationType } from 'store/notification/notification';

interface BancorState {
  tokenLists: TokenList[];
  tokens: Token[];
  keeperDaoTokens: KeeprDaoToken[];
  allTokenListTokens: TokenMinimal[];
  allTokens: Token[];
  isLoadingTokens: boolean;
  statistics: Statistic[];
}

export const initialState: BancorState = {
  tokenLists: [],
  tokens: [],
  allTokens: [],
  keeperDaoTokens: [],
  allTokenListTokens: [],
  isLoadingTokens: true,
  statistics: [],
};

const bancorSlice = createSlice({
  name: 'bancor',
  initialState,
  reducers: {
    setTokens: (state, action) => {
      state.tokens = action.payload;
    },
    setAllTokens: (state, action) => {
      state.allTokens = action.payload;
      state.isLoadingTokens = false;
    },
    setTokenLists: (state, action) => {
      state.tokenLists = action.payload;
    },
    setAllTokenListTokens: (state, action) => {
      state.allTokenListTokens = action.payload;
    },
    setKeeperDaoTokens: (state, action) => {
      state.keeperDaoTokens = action.payload;
    },
    setStatisticsV3: (state, action: PayloadAction<Statistic[]>) => {
      state.statistics = action.payload;
    },
  },
});

export const {
  setTokens,
  setTokenLists,
  setAllTokens,
  setStatisticsV3,
  setAllTokenListTokens,
  setKeeperDaoTokens,
} = bancorSlice.actions;

export const getTokenById = createSelector(
  (state: RootState) => getAllTokensMap(state),
  (_: any, id: string) => id,
  (allTokensMap: Map<string, Token>, id: string): Token | undefined => {
    if (!id) return undefined;
    return allTokensMap.get(utils.getAddress(id));
  }
);

export const getTopMovers = createSelector(
  (state: RootState) => state.bancor.tokens,
  (tokens: Token[]) => {
    const filtered = tokens.filter(
      (t) => t.isProtected && Number(t.liquidity ?? 0) > 100000
    );
    return orderBy(filtered, 'price_change_24', 'desc').slice(0, 20);
  }
);

export const bancor = bancorSlice.reducer;

export const getIsAppBusy = createSelector(
  [
    (state: RootState) => state.v3Portfolio.isPortfolioLoading,
    (state: RootState) => state.notification.notifications,
  ],
  (isPortfolioLoading, notifications): boolean => {
    const hasPendingTx = notifications.some(
      (n) => n.type === NotificationType.pending
    );
    return isPortfolioLoading || hasPendingTx;
  }
);
