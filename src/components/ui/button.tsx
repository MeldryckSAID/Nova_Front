import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-royal-blue text-white hover:bg-royal-blue/90",
        destructive: "bg-soft-error-red text-white hover:bg-soft-error-red/90",
        outline:
          "border border-royal-blue/30 bg-background text-royal-blue hover:bg-royal-blue/10 hover:text-royal-blue hover:border-royal-blue",
        secondary:
          "bg-light-blue-gray/20 text-primary-text hover:bg-light-blue-gray/30 dark:bg-royal-blue/20 dark:text-dark-base-text dark:hover:bg-royal-blue/30",
        ghost:
          "text-primary-text hover:bg-royal-blue/10 hover:text-royal-blue dark:text-dark-base-text dark:hover:bg-royal-blue/20",
        link: "text-royal-blue underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
