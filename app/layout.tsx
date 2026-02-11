import "./globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import Header from "@/components/Header/Header";
import React from "react";
import ReduxProvider from "@/store/ReduxProvider";

const roboto = Roboto({
    subsets: ["latin", "cyrillic"],
    weight: ["400", "500", "700", "900"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "SkyFitnessPro",
    description: "Онлайн-тренировки для дома",
};

export default function RootLayout({
                                       children,
                                       modal,
                                   }: {
    children: React.ReactNode;
    modal: React.ReactNode;
}) {
    return (
        <html lang="ru">
        <body className={roboto.className}>
        <ReduxProvider>
            <Header />
            <div className="container">
                <main>{children}</main>
            </div>
            {modal}
        </ReduxProvider>
        </body>
        </html>
    );
}
