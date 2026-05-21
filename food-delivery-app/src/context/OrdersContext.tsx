import React, {
    createContext,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";

export type Order = {
    id: number;
    restaurant: string;
    status: string;
    eta: string;
    total: string;
    image: string;
    dishId?: number;
    dishName?: string;
    dishDescription?: string;
};

type Dish = {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
};

type OrdersContextValue = {
    orders: Order[];
    addOrder: (restaurantName: string, dish: Dish) => void;
    clearOrders: () => void;
};

const OrdersContext = createContext<OrdersContextValue | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
    const [orders, setOrders] = useState<Order[]>([]);

    const addOrder = (restaurantName: string, dish: Dish) => {
        setOrders((currentOrders) => {
            if (currentOrders.some((order) => order.dishId === dish.id)) {
                return currentOrders;
            }

            const nextId = currentOrders.length
                ? Math.max(...currentOrders.map((order) => order.id)) + 1
                : 1;

            const nextOrder: Order = {
                id: nextId,
                restaurant: restaurantName,
                status: "Pending",
                eta: "--",
                total: `₹${dish.price.toFixed(0)}`,
                image: dish.image,
                dishId: dish.id,
                dishName: dish.name,
                dishDescription: dish.description,
            };

            return [...currentOrders, nextOrder];
        });
    };

    const clearOrders = () => {
        setOrders([]);
    };

    const value = useMemo(
        () => ({
            orders,
            addOrder,
            clearOrders,
        }),
        [orders],
    );

    return (
        <OrdersContext.Provider value={value}>
            {children}
        </OrdersContext.Provider>
    );
}

export function useOrders() {
    const context = useContext(OrdersContext);

    if (!context) {
        throw new Error("useOrders must be used within an OrdersProvider");
    }

    return context;
}
