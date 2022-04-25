import { V3Withdraw } from 'elements/earn/portfolio/v3/pendingWithdraw/V3Withdraw';
import V3ExternalHoldings from 'elements/earn/portfolio/v3/externalHoldings/V3ExternalHoldings';
import { V3TotalHoldings } from 'elements/earn/portfolio/v3/V3TotalHoldings';
import { V3HoldingsStats } from 'elements/earn/portfolio/v3/V3HoldingsStats';
import { V3EarningTable } from 'elements/earn/portfolio/v3/earningsTable/V3EarningTable';
import { V3AvailableToStake } from 'elements/earn/portfolio/v3/V3AvailableToStake';
import { Button, ButtonSize } from 'components/button/Button';
import { useDispatch } from 'react-redux';
import { ReactComponent as IconWallet } from 'assets/icons/wallet.svg';
import { openWalletModal } from 'store/user/user';
import { memo } from 'react';
import { useAppSelector } from 'store';
import { V3ClaimBonuses } from 'elements/earn/portfolio/v3/bonuses/V3ClaimBonuses';

const V3Portfolio = () => {
  const account = useAppSelector((state) => state.user.account);
  const dispatch = useDispatch();

  const handleLoginClick = () => {
    dispatch(openWalletModal(true));
  };

  return account ? (
    <div className="grid grid-cols-12 lg:gap-x-[36px]">
      <div className="col-span-12 lg:col-span-12 xl:col-span-8 space-y-20">
        <V3TotalHoldings />
        <V3HoldingsStats />
        <V3EarningTable />
        <V3AvailableToStake />
      </div>
      <div className="col-span-12 lg:col-span-12 xl:col-span-4 space-y-20">
        <V3ClaimBonuses />
        <V3Withdraw />
        <V3ExternalHoldings />
      </div>
    </div>
  ) : (
    <div className="max-w-[320px] mx-auto">
      <h2 className="text-20 text-center font-medium">
        Connect your wallet to see your earnings and impermanent loss
      </h2>
      <div className="flex justify-center mt-20">
        <Button size={ButtonSize.SMALL} onClick={() => handleLoginClick()}>
          <IconWallet className="w-20 mr-10" />
          Connect Wallet
        </Button>
      </div>
    </div>
  );
};

export default memo(V3Portfolio);
