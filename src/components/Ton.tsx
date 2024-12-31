import React, { useEffect, useState } from 'react';
import { TonClient, Address, fromNano } from 'ton';
import { Card, FlexBoxCol, FlexBoxRow } from './styled/styled';
import { useTonConnect } from '../hooks/useTonConnect';

const WalletInfo: React.FC = () => {
    const [balance, setBalance] = useState<number | null>(null);
    const { wallet } = useTonConnect();

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const client = new TonClient({endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC'});
                const address = Address.parse(wallet ? wallet : '');
                const balanceNano = await client.getBalance(address);
                setBalance(parseFloat(fromNano(balanceNano))); 
            } catch (error) {
                console.error('Error fetching balance with ton-core:', error);
            }
        };

        fetchBalance();
    }, [wallet]);

    return (
        <Card title="Jetton" style={{ backgroundColor: 'rgba(0,0,0,0.8)', color: 'white', fontFamily: 'Arial, sans-serif'}}>
            <FlexBoxCol>
                <h3 style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>TON</h3>
                <FlexBoxRow>
                    Balance:
                    {balance !== null ? ( <p> {balance} TON</p>
                    ) : (<p>Loading...</p>)}
                </FlexBoxRow>
            </FlexBoxCol>
        </Card>
    );
};

export default WalletInfo;
