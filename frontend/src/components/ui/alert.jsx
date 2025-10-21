import * as React from "react"

const Alert = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variantClasses = {
    default: "bg-gray-50 text-gray-900 border-gray-200",
    destructive: "bg-red-50 text-red-900 border-red-200"
  };

  return (
    <div
      ref={ref}
      role="alert"
      className={`relative w-full rounded-lg border p-4 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  )
})
Alert.displayName = "Alert"

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`text-sm [&_p]:leading-relaxed ${className}`}
      {...props}
    />
  )
})
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertDescription }

