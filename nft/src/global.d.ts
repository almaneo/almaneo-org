/// <reference types="vite/client" />

import { Buffer } from 'buffer'

declare global {
  interface Window {
    Buffer: typeof Buffer
    process: {
      env: Record<string, string>
      browser: boolean
      version: string
      nextTick: (fn: () => void) => void
    }
  }
}

export {}
