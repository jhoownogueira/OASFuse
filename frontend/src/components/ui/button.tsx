import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "default" | "primary";
};

export function Button({
  asChild = false,
  className = "",
  variant = "default",
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : "button";
  const variantClass = variant === "primary" ? " button-primary" : "";

  return (
    <Component
      className={`button${variantClass}${className ? ` ${className}` : ""}`}
      {...props}
    />
  );
}
