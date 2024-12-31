import { useFaucetJettonContract } from "../hooks/useFaucetJettonContract";
import {Card, FlexBoxCol, FlexBoxRow, Ellipsis} from "./styled/styled";

export function Jetton() {
  const { jettonWalletAddress, balance } = useFaucetJettonContract();
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
      </FlexBoxCol>
    </Card>
  );
}
