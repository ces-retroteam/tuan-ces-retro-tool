
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SessionProvider } from "@/context/SessionContext";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CreateSession from "./pages/CreateSession";
import SessionPage from "./pages/SessionPage";
import JoinSession from "./pages/JoinSession";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <SessionProvider>
            <TooltipProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/create-session" element={<CreateSession />} />
                        <Route path="/session/:sessionId" element={<SessionPage />} />
                        <Route path="/join/:sessionId" element={<JoinSession />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                    <Toaster />
                    <Sonner />
                </BrowserRouter>
            </TooltipProvider>
        </SessionProvider>
    </QueryClientProvider>
);

export default App;
