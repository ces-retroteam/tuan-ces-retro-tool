
import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const isMobile = useIsMobile();

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
            <Header />
            <main className={`flex-grow container mx-auto ${isMobile ? 'px-4' : 'px-14'} py-8 max-w-screen-2xl`}>
                {children}
            </main>
            <Footer />
        </div>
    );
}
