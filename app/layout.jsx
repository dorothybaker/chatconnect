import { Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const playfair = Playfair_Display({ subsets: ["latin"], weight: "400" });

export const metadata = {
  title: "ChatConnect",
  description: "Connecting people through chatting!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <link
        rel="shortcut icon"
        href="https://www.svgrepo.com/show/95354/chat.svg"
        type="image/x-icon"
      />
      <body className={playfair.className}>
        <Toaster containerStyle={{ fontWeight: "600" }} />
        <div className="sm:p-4 px-3 min-h-screen justify-center flex items-center relative">
          {children}
        </div>
      </body>
    </html>
  );
}
