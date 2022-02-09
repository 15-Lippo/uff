import { Button } from 'components/button/Button';
import { TokenInputV3 } from 'components/tokenInput/TokenInputV3';

interface Props {
  amount: string;
  setAmount: (amount: string) => void;
  setStep: (step: number) => void;
}

export const V3WithdrawStep1 = ({ setStep, amount, setAmount }: Props) => {
  return (
    <div className="text-center">
      <h1 className="text-[36px] font-normal mb-50">
        How much ETH do you want to withdraw?
      </h1>
      <h2 className="font-normal opacity-50">Available 0.123456 ETH</h2>

      <TokenInputV3 amount={amount} setAmount={setAmount} />

      <div className="space-x-10 opacity-50">
        <button>25%</button>
        <button>50%</button>
        <button>75%</button>
        <button>100%</button>
      </div>

      <div className="flex justify-center">
        <Button
          className="px-50 my-40"
          onClick={() => setStep(2)}
          disabled={!amount}
        >
          Next {'->'}
        </Button>
      </div>

      <div className="opacity-50 space-y-10">
        <p>USD value will likely change during the cooldown period</p>
        <p>Coverage cost 0.25% - 0.0025 ETH</p>
      </div>
    </div>
  );
};
