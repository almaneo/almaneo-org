/// <reference types="vite/client" />

import type { Buffer as BufferType } from 'buffer/'

declare global {
  interface Window {
    Buffer: typeof BufferType
  }

  // eslint-disable-next-line no-var
  var Buffer: typeof BufferType
}

export {}
