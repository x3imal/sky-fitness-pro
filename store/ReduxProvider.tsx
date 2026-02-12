"use client";

import { Provider } from "react-redux";
import { persistor, store } from "./store";
import React from "react";
import { PersistGate } from "redux-persist/integration/react";
import StoreBootstrap from "@/store/StoreBootstrap";

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <StoreBootstrap />
                {children}
            </PersistGate>
        </Provider>
    );
}
