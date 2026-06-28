import type { Config } from '@react-router/dev/config'

export default {
  ssr: true,
  allowedActionOrigins: ['afterworks.jp', '*.afterworks.jp', '**.afterworks.jp'],
} satisfies Config
