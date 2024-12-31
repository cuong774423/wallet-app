import { useFaucetBDContract } from "../hooks/useFaucetJettonContract";
import {Card, FlexBoxCol, FlexBoxRow, Ellipsis} from "./styled/styled";

export function BDCoin() {
  const { jettonWalletAddress, balance } = useFaucetBDContract();

  return (
    <Card title="Jetton" style={{ backgroundColor: 'rgba(0,0,0,0.8)', color: 'white', fontFamily: 'Arial, sans-serif'}}>
      <FlexBoxCol>
        <h3 style={{textTransform: 'uppercase', fontWeight: 'bold'}}>BDCoin</h3>
        <FlexBoxRow>
          Wallet
          <Ellipsis>{jettonWalletAddress}</Ellipsis>
        </FlexBoxRow>
        <FlexBoxRow>
            Balance:
            {balance !== null ? (<p> {balance} BD</p>
            ) : (<p>Loading...</p>)}
        </FlexBoxRow>
      </FlexBoxCol>
    </Card>
  );
}
