// needed for Amplify, will remove if not used
;(window as any).global = window
;(window as any).process = {
  env: { DEBUG: undefined },
}
