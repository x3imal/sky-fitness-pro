"use client";

import Link from "next/link";

export default function Header() {
    return (
        <header style={{ borderBottom: "1px solid #222", padding: "16px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Link href="/" style={{ fontWeight: 700, textDecoration: "none" }}>
                    SkyFitnessPro
                </Link>

                <nav style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <Link href="/profile" style={{ textDecoration: "none" }}>Профиль</Link>
                    <Link href="/auth" style={{ textDecoration: "none" }}>Войти</Link>
                </nav>
            </div>
        </header>
    );
}
