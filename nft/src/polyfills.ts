/**
 * Web3Auth에 필요한 Node.js polyfills
 * Vite 7 환경에서 Buffer, Stream 등의 Node.js 모듈을 브라우저에서 사용하기 위함
 */

import { Buffer } from 'buffer/'

// nextTick을 실제 함수로 정의 (bind 메서드 필요)
function nextTick(fn: (...args: unknown[]) => void, ...args: unknown[]) {
  setTimeout(() => fn(...args), 0)
}

// process 객체 polyfill (Node.js 호환)
const processPolyfill = {
  env: {},
  browser: true,
  version: '',
  nextTick: nextTick,
  binding: () => ({}),
  cwd: () => '/',
  chdir: () => {},
  umask: () => 0,
  platform: 'browser',
  pid: 1,
  title: 'browser',
  argv: [],
  versions: { node: '16.0.0' },
  on: () => processPolyfill,
  once: () => processPolyfill,
  off: () => processPolyfill,
  emit: () => false,
  addListener: () => processPolyfill,
  removeListener: () => processPolyfill,
  listeners: () => [],
}

// 먼저 globalThis에 설정 (가장 먼저 실행되어야 함)
if (typeof globalThis !== 'undefined') {
  (globalThis as unknown as { Buffer: typeof Buffer }).Buffer = Buffer
  ;(globalThis as unknown as { process: typeof processPolyfill }).process = processPolyfill
}

// window 객체에도 설정
if (typeof window !== 'undefined') {
  ;(window as unknown as { process: typeof processPolyfill }).process = processPolyfill
  window.Buffer = window.Buffer || Buffer
}

export { Buffer }
