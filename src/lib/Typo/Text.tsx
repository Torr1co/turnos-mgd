import React from 'react'
import { cn } from '~/utils/styles'
import { FC } from '~/utils/types';


export default function Text ({ className, children }: FC) {
  return (
    <p className={cn('text-base font-regular', className)}>
      {children}
    </p>
  )
}