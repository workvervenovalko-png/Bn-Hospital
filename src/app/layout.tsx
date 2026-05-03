"use client";

import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/shared/Sidebar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <html lang="en" className="h-full antialiased dark">
      <body className={cn(
        "min-h-screen bg-dark-200 font-sans antialiased",
        jakarta.variable
      )}>
        <div className="flex h-screen overflow-hidden">
          {!isLoginPage && <Sidebar />}
          
          <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/10 blur-[120px] rounded-full -z-10" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full -z-10" />
            
            {!isLoginPage && (
              <header className="h-20 flex items-center justify-between px-10 glass border-b border-white/5 sticky top-0 z-40">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Enterprise Console</h2>
                  <p className="text-xs text-sidebar-fg">Bn Hospital | Production Environment</p>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end mr-2">
                    <span className="text-sm font-semibold text-white">Administrator</span>
                    <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Active Session</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl green-gradient flex items-center justify-center text-white shadow-xl shadow-green-500/20 ring-2 ring-white/10">
                    <span className="text-sm font-black">AD</span>
                  </div>
                </div>
              </header>
            )}

            <div className={cn(
              "flex-1 overflow-y-auto remove-scrollbar",
              isLoginPage ? "" : "p-10"
            )}>
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}


