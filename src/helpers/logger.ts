import {
  ConsoleInstrumentation,
  ErrorsInstrumentation,
  Faro,
  initializeFaro,
} from '@grafana/faro-web-sdk'
import { environment } from '../environment'
import pino from 'pino'

const { isProd } = environment

const sendLogsToFaro = isProd
// logs must be serialized when pushed to faro
const serializeLogs = isProd

let mutableFaro: Faro | null = null

if (sendLogsToFaro) {
  mutableFaro = initializeFaro({
    url: 'https://faro.bratislava.sk/collect',
    apiKey: environment.faroSecret,
    instrumentations: [new ErrorsInstrumentation(), new ConsoleInstrumentation()],
    app: {
      name: 'kupaliska-starz-fe',
      version: '1.0.0',
      environment: 'production',
    },
  })
}

export const logger = pino({
  browser: {
    asObject: serializeLogs,
    transmit: sendLogsToFaro
      ? {
          send: function (_level, logEvent) {
            mutableFaro?.api.pushLog([JSON.stringify(logEvent)])
          },
        }
      : undefined,
  },
})

// done like this to comply with eslint's import/no-mutable-exports
export const faro = mutableFaro

export default logger
