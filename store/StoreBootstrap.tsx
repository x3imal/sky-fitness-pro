"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCatalog } from "@/store/slices/catalogSlice";
import { RootState } from "@/store/store";

export default function StoreBootstrap() {
    const dispatch = useAppDispatch();
    const status = useAppSelector((state: RootState) => state.catalog.status);

    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchCatalog());
        }
    }, [dispatch, status]);

    return null;
}
