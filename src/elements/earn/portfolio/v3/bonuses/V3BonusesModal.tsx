import { useV3Bonuses } from 'elements/earn/portfolio/v3/bonuses/useV3Bonuses';
import { Image } from 'components/image/Image';
import { Button, ButtonVariant } from 'components/button/Button';
import { prettifyNumber } from 'utils/helperFunctions';
import { GroupedStandardReward } from 'store/portfolio/v3Portfolio';
import { shrinkToken } from 'utils/formulas';
import { Modal } from 'components/modal/Modal';
import { useCallback, useMemo, useState } from 'react';
import { TokensOverlap } from 'components/tokensOverlap/TokensOverlap';
import { ReactComponent as IconCheck } from 'assets/icons/check.svg';
import { ReactComponent as IconChevron } from 'assets/icons/chevronDown.svg';
import { useAppSelector } from 'store';
import BigNumber from 'bignumber.js';
import { getDarkMode } from 'store/user/user';

const BonusGroupItems = ({
  rewardsGroup,
  setSelectedIds,
  selectedIds,
}: {
  rewardsGroup: GroupedStandardReward;
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
}) => {
  const addOrRemove = (id: string) => {
    const exists = selectedIds.includes(id);

    if (exists) {
      const ids = selectedIds.filter((idx) => idx !== id);
      setSelectedIds(ids);
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="mb-10 mt-20 px-20 space-y-10">
      <div className="flex items-center justify-between text-black-low dark:text-white-low">
        Bonus
        <span className="flex start w-[80px]">From</span>
      </div>
      {rewardsGroup.rewards.map((reward) => {
        const isSelected = selectedIds.includes(reward.id);
        return (
          <button
            key={reward.id}
            className="rounded w-full"
            onClick={() => addOrRemove(reward.id)}
          >
            <div className="flex items-center justify-between text-16">
              <div className="flex items-center">
                <div
                  className={`${
                    isSelected
                      ? 'bg-primary'
                      : 'border border-black-low dark:bg-black'
                  } rounded-[4px] w-16 h-16 flex items-center justify-center`}
                >
                  {isSelected && <IconCheck className="w-10 text-white" />}
                </div>
                <Image
                  alt={'Token Logo'}
                  className="w-30 h-30 rounded-full mx-20"
                  src={reward.rewardsToken.logoURI}
                />
                {prettifyNumber(
                  shrinkToken(
                    reward.pendingRewardsWei,
                    rewardsGroup.groupPool.decimals
                  )
                )}{' '}
                {reward.rewardsToken.symbol}
              </div>

              <div className="flex items-center gap-10 w-[80px]">
                <Image
                  alt={'Token Logo'}
                  className="w-30 h-30 rounded-full"
                  src={reward.programPool.reserveToken.logoURI}
                />
                {reward.programPool.reserveToken.symbol}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

const BonusGroup = ({
  rewardsGroup,
}: {
  rewardsGroup: GroupedStandardReward;
}) => {
  const darkMode = useAppSelector<boolean>(getDarkMode);
  const { handleClaim, handleClaimAndEarn } = useV3Bonuses();
  const { groupPool } = rewardsGroup;
  const allTokens = rewardsGroup.rewards.map(
    (reward) => reward.programPool.reserveToken
  );
  const allIds: string[] = rewardsGroup.rewards.map((reward) => reward.id);
  const [selectedIds, setSelectedIds] = useState(allIds);
  const [isTxClaimBusy, setIsTxClaimBusy] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const bntDisabled = selectedIds.length === 0 || isTxClaimBusy;

  const onClaimClick = useCallback(async () => {
    setIsTxClaimBusy(true);
    await handleClaim(selectedIds);
    setIsTxClaimBusy(false);
  }, [handleClaim, selectedIds]);

  const onRestakeClick = useCallback(async () => {
    setIsTxClaimBusy(true);
    await handleClaimAndEarn(selectedIds);
    setIsTxClaimBusy(false);
  }, [handleClaimAndEarn, selectedIds]);
  const amount = shrinkToken(
    rewardsGroup.totalPendingRewards,
    groupPool.decimals
  );
  const usdAmount = useMemo(
    () =>
      new BigNumber(amount).times(rewardsGroup.groupPool.reserveToken.usdPrice),
    [amount, rewardsGroup.groupPool.reserveToken.usdPrice]
  );

  return (
    <div>
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Image
              alt={'Token'}
              className="w-40 h-40 rounded-full"
              src={groupPool.reserveToken.logoURI}
            />
            {groupPool.reserveToken.symbol}
          </div>

          <div>
            <div className="text-20 text-black dark:text-white">
              {prettifyNumber(amount)}
            </div>
            <div className="flex justify-end text-black-low dark:text-white-low">
              ~{prettifyNumber(usdAmount, true)}
            </div>
          </div>
        </div>

        <div className="bg-secondary p-10 rounded mb-30 mt-20">
          <button
            onClick={() => setShowMore((prev) => !prev)}
            className="flex justify-between items-center px-20 h-[40px] w-full"
          >
            <div className="text-black dark:text-white">Explore Bonuses</div>
            <div className="flex items-center">
              {!showMore && (
                <div>
                  <TokensOverlap tokens={allTokens} />
                </div>
              )}
              <IconChevron
                className={`w-14 ml-20 ${
                  showMore ? 'transform rotate-180' : ''
                }`}
              />
            </div>
          </button>
          {showMore && (
            <div>
              <BonusGroupItems
                rewardsGroup={rewardsGroup}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex space-x-10 mt-20">
        <Button
          variant={ButtonVariant.SECONDARY}
          onClick={onClaimClick}
          className="w-full"
          disabled={bntDisabled}
        >
          Claim
        </Button>
        <Button
          variant={darkMode ? ButtonVariant.LIGHT : ButtonVariant.DARK}
          onClick={onRestakeClick}
          className="w-full"
          disabled={bntDisabled}
        >
          Claim {groupPool.reserveToken.symbol} {'&'} Earn{' '}
          {groupPool.apr.total.toFixed(2)}%
        </Button>
      </div>
    </div>
  );
};

export const V3BonusesModal = () => {
  const { bonuses, isBonusModalOpen, setBonusModalOpen } = useV3Bonuses();

  return (
    <Modal
      title="Claim Bonuses"
      isOpen={isBonusModalOpen}
      setIsOpen={setBonusModalOpen}
      large
    >
      <div>
        {bonuses.map((group) => (
          <div key={group.groupId} className="p-30">
            <BonusGroup rewardsGroup={group} />
          </div>
        ))}
      </div>
    </Modal>
  );
};
