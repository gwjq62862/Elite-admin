// app/layout.tsx
import { Inter } from "next/font/google";
import "./globals.css";
import DashboardWrapper from "./components/DashboardWrapper";


const inter = Inter({ subsets: ["latin"], variable: "--font-display" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Material Symbols Icons link */}
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
        {/* Inter Font (Custom font-display) */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap" rel="stylesheet"/>
        {/* Icons Style Definitions */}
        <style>
            {`
            .material-symbols-outlined {
                font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
                font-size: 24px;
            }
            .material-symbols-outlined.fill {
                font-variation-settings: 'FILL' 1;
            }
            `}
        </style>
      </head>
      
    
      <body className={`bg-background-light dark:bg-background-dark ${inter.className}`}>
     
        <DashboardWrapper>
            {children}
        </DashboardWrapper>
      </body>
    </html>
  );
}