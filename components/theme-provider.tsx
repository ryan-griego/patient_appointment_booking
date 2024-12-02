//"use client"

// import * as React from "react"
// import { ThemeProvider as NextThemesProvider } from "next-themes"

// export function ThemeProvider({
//   children,
//   ...props
// }: React.ComponentProps<typeof NextThemesProvider>) {
//   return <NextThemesProvider {...props}>{children}</NextThemesProvider>
// }

"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  const [mounted, setMounted] = React.useState(false);

  // Set `mounted` to true after the component has been mounted
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid rendering `NextThemesProvider` until the client has mounted
  if (!mounted) return null;

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
