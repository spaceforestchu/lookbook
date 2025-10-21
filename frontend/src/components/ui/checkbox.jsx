import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { cn } from "@/lib/utils"
import { CheckIcon } from "@radix-ui/react-icons"

const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "grid place-content-center peer h-4 w-4 shrink-0 rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 bg-white data-[state=checked]:border-0",
      className
    )}
    style={{
      backgroundColor: props.checked || props['data-state'] === 'checked' ? '#4242ea' : 'white',
      border: props.checked || props['data-state'] === 'checked' ? 'none' : 'none'
    }}
    {...props}>
    <CheckboxPrimitive.Indicator className={cn("grid place-content-center text-white")}>
      <CheckIcon className="h-3 w-3" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
