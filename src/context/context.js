import React, { useReducer, createContext } from 'react';

import contextReducer from './contextReducer';

const initialState = JSON.parse(localStorage.getItem("transactions")) || [
    {
        "amount": 100,
        "category": "Salary",
        "type": "Income",
        "date": "2021-03-15",
        "id": "cccd2a29-1e2c-49ee-89a3-a8a964f2492f"
    },
    {
        "amount": 100,
        "category": "Salary",
        "type": "Income",
        "date": "2021-03-15",
        "id": "f1cbc630-186c-4ffd-b761-1e5296342a36"
    },
    {
        "amount": 5,
        "category": "House",
        "type": "Expense",
        "date": "2021-03-16",
        "id": "bbcae608-3b94-40ad-9df1-f3ff808af4c9"
    }
]

export const ExpenseTrackerContext = createContext(initialState);

export const Provider = ({ children }) => {
    const [transactions, dispatch] = useReducer(contextReducer, initialState);
    //delete transactions
    const deleteTransaction = (id) => {
        dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    };
    //adding transactions
    const addTransaction = (transaction) => {
        dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
    };

    // console.log(transactions);
    //calculating balance
    const balance = transactions.reduce((acc, currVal) => {
        return (currVal.type === "Expense" ? acc - currVal.amount : acc + currVal.amount)
    }, 0);

    return (
        <ExpenseTrackerContext.Provider value={{
            transactions,
            deleteTransaction,
            addTransaction,
            balance
        }}
        >
            {children}
        </ExpenseTrackerContext.Provider>
    );
};