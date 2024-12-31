import { useFaucetJettonContract } from "../hooks/useFaucetJettonContract";
import { useTonConnect } from "../hooks/useTonConnect";
import {Card, FlexBoxCol, FlexBoxRow, Button, Ellipsis} from "./styled/styled";

export function Jetton() {
  const {connected} = useTonConnect();
  const { jettonWalletAddress, balance, mint } = useFaucetJettonContract();

  return (
    <Card title="Jetton" style={{ backgroundColor: 'rgba(0,0,0,0.8)', color: 'white', fontFamily: 'Arial, sans-serif'}}>
      <FlexBoxCol>
        <h3 style={{textTransform: 'uppercase', fontWeight: 'bold'}}>Jetton</h3>
        <FlexBoxRow>
          Wallet
          <Ellipsis>{jettonWalletAddress}</Ellipsis>
        </FlexBoxRow>
        <FlexBoxRow>
          Balance:
          {balance !== null ? ( <p>{balance} TON</p>
          ) : (<p>Loading...</p>)}
        </FlexBoxRow>
        <Button
          disabled={!connected}
          onClick={async () => {
            mint();
          }}
        >
          Get jettons from faucet
        </Button>
      </FlexBoxCol>
    </Card>
  );
}
