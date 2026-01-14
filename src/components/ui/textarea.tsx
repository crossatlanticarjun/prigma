import { cn } from '@/utilities/ui'
import * as React from 'react'

const Textarea: React.FC<
  {
    ref?: React.Ref<HTMLTextAreaElement>
  } & React.TextareaHTMLAttributes<HTMLTextAreaElement>
> = ({ className, ref, ...props }) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[80px] w-full rounded border border-slate-300 bg-background px-3 py-2 text-sm placeholder:text-muted-foreground  disabled:cursor-not-allowed disabled:opacity-50 duration-500 focus:border-themeOrange outline-none',
        className,
      )}
      ref={ref}
      {...props}
    />
  )
}

export { Textarea }
