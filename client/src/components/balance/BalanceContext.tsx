import {fetchBalance} from '../../utils/fetchBalance'
import { createContext,useState, useEffect, useContext, ReactNode } from 'react'
import { useAuth } from "../../context/AuthContext";

interface BalanceContextProps {
    balance: number | null
    isLoading: boolean
    isLowBalance: boolean
    refreshBalance: () => void
}

const BalanceContext = createContext<BalanceContextProps | undefined>(undefined)
const LOW_BALANCE_THRESHOLD = 30.0

export const BalanceProvider = ({children}:{children: ReactNode}) => {
    const [balance, setBalance] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const isAuthenticated= useAuth();

    const refreshBalance = async () => {
        if (!isAuthenticated) {
            setBalance(null)
            return
        }
        setIsLoading(true)
        try {
            const fetchedBalance = await fetchBalance()
            setBalance(fetchedBalance)
        }
        catch (error) {
            console.error('Failed to fetch balance:', error)
            setBalance(null)
        }
        finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            refreshBalance()
        }
        else {
            setBalance(null)
        }
    }, [isAuthenticated, balance])

    const isLowBalance = balance !== null && balance < LOW_BALANCE_THRESHOLD

    return (
        <BalanceContext.Provider value={{balance, isLowBalance, isLoading, refreshBalance}}>
            {children}
        </BalanceContext.Provider>
    )
}

export const useBalance = () : BalanceContextProps => {
    const context = useContext(BalanceContext)
    if (context === undefined) {
        throw new Error('useBalance must be used within a BalanceProvider')
    }
    return context;
}

