import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "header" | "footer" | "main" | "nav";
};

export function Container({ children, className, as: As = "div" }: ContainerProps) {
  return (
    <As className={cn("max-w-7xl mx-auto px-4 md:px-6 lg:px-8", className)}>
      {children}
    </As>
  );
}
