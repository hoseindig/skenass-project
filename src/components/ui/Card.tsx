import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300",
        "border border-gray-100",
        className
      )}
      {...props}
    />
  );
}
