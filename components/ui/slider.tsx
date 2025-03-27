"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number[]
  min?: number
  max?: number
  step?: number
  onValueChange?: (value: number[]) => void
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ className, value = [0], min = 0, max = 100, step = 1, onValueChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = [Number.parseInt(e.target.value, 10)]
      if (onValueChange) {
        onValueChange(newValue)
      }
    }

    const percentage = ((value[0] - min) / (max - min)) * 100

    return (
      <div ref={ref} className={cn("relative flex w-full touch-none select-none items-center", className)} {...props}>
        <div className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-zinc-800">
          <div className="absolute h-full bg-blue-600" style={{ width: `${percentage}%` }} />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={handleChange}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
        <div
          className="absolute h-4 w-4 rounded-full border border-zinc-700 bg-blue-600"
          style={{ left: `calc(${percentage}% - 8px)` }}
        />
      </div>
    )
  },
)
Slider.displayName = "Slider"

export { Slider }

