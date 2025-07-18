// src/types/pinia-auth.d.ts
import 'pinia'

interface User {
  id: string
  name: string
  email: string
  birth: string
  password: string
}

declare module 'pinia' {
  export interface PiniaCustomProperties {
    login(user: User): void
    logout(): void
  }
}