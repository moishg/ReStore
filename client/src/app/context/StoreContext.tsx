import { createContext, PropsWithChildren, useContext, useState } from "react";
import { Basket } from "../models/basket";

interface StoreContextValue {
    basket: Basket | null;
    setBasket: (basket: Basket) => void;
    removeItem: (productId: number, quantity: number) => void;
}

export const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export function useStoreContext() {
    const context = useContext(StoreContext);
    if (context === undefined) {
        throw Error('Oops - we do not seemt to be inside the provider');
    }

    return context;
}

export function StoreProvider({ children }: PropsWithChildren<any>) {
    const [basket, setBasket] = useState<Basket | null>(null);

    function removeItem(productId: number, quantity: number) {
        if (!basket)
            return;
        else {
            const items = [...basket.items];//create new instance(copy) of the items array and store it in the variable
            //react prefer copy the existing state array and then ovewrite the existing state with the new copy

            const itemIndex = items.findIndex(i => i.productId == productId);
            if (itemIndex >= 0) {
                items[itemIndex].quantity -= quantity;
                if (items[itemIndex].quantity === 0) {
                    items.splice(itemIndex, 1);
                }

                setBasket(prevState => {
                    return { ...prevState!, items }
                })
            }           
        }

    }

    return (
        <StoreContext.Provider value={{basket, setBasket, removeItem }}>
            {children}
        </StoreContext.Provider>
    )

}