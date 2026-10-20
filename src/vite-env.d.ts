/// <reference types="vite/client" />

declare global {
  interface Window {
    /**
     * Copies text to the clipboard.
     *
     * Provided by the vanilla layer in `public/vanilla.js`, which is loaded
     * as a classic script rather than bundled with the application.
     */
    vellumCopy?: (text: string) => Promise<boolean>
  }
}

export {}
