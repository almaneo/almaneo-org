/**
 * Web3Auth에 필요한 Node.js polyfills
 * Vite 7 환경에서 Buffer 등의 Node.js 모듈을 브라우저에서 사용하기 위함
 */

import { Buffer } from 'buffer/'

// nextTick 함수 생성 (bind 메서드 포함)
function createNextTick() {
  const nextTick = (fn: (...args: unknown[]) => void, ...args: unknown[]) => {
    setTimeout(() => fn(...args), 0)
  }
  // bind 메서드가 있는 함수로 만들기 위해 Function.prototype 사용
  return nextTick
}

// process 객체 polyfill (Node.js 호환)
const processPolyfill = {
  env: {},
  browser: true,
  version: '',
  nextTick: createNextTick(),
  platform: 'browser',
  cwd: () => '/',
  binding: () => ({}),
}

if (typeof window !== 'undefined') {
  // window에 process 추가
  if (typeof window.process === 'undefined') {
    (window as unknown as { process: typeof processPolyfill }).process = processPolyfill
  }
  // window에 Buffer 추가
  window.Buffer = window.Buffer || Buffer
}

// globalThis에도 추가 (일부 라이브러리에서 필요)
if (typeof globalThis !== 'undefined') {
  (globalThis as unknown as { Buffer: typeof Buffer }).Buffer = Buffer
  if (typeof (globalThis as unknown as { process?: typeof processPolyfill }).process === 'undefined') {
    (globalThis as unknown as { process: typeof processPolyfill }).process = processPolyfill
  }
}

export { Buffer }
