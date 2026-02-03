import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import ReduxProvider from "../store/ReduxProvider";
import Header from "@/components/Header/Header";

export const metadata: Metadata = {
    title: "SkyFitnessPro",
    description: "Fitness courses",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ru">
        <body>
        <ReduxProvider>
            <Header />
            <main style={{ padding: "24px" }}>{children}</main>
        </ReduxProvider>
        </body>
        </html>
    );
}
