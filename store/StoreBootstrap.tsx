"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCatalog } from "@/store/slices/catalogSlice";
import { fetchCurrentUser } from "@/store/slices/authSlice";
import { RootState } from "@/store/store";

export default function StoreBootstrap() {
    const dispatch = useAppDispatch();
    const catalogStatus = useAppSelector((state: RootState) => state.catalog.status);
    const authStatus = useAppSelector((state: RootState) => state.auth.status);
    const token = useAppSelector((state: RootState) => state.auth.token);
    const currentUser = useAppSelector((state: RootState) => state.auth.currentUser);

    useEffect(() => {
        if (catalogStatus === "idle") {
            dispatch(fetchCatalog());
        }
    }, [catalogStatus, dispatch]);

    useEffect(() => {
        if (token && !currentUser && authStatus !== "loading") {
            dispatch(fetchCurrentUser());
        }
    }, [authStatus, currentUser, dispatch, token]);

    return null;
}
