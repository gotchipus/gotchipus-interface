export interface TranslationKeys {
  common: {
    welcome: string
    loading: string
    error: string
    success: string
    cancel: string
    confirm: string
    back: string
    next: string
    welcomeMessage: string
  }
  auth: {
    login: string
    logout: string
    register: string
    forgotPassword: string
  }
  validation: {
    required: string
    invalidEmail: string
    passwordMismatch: string
  }
  account: {
    header: {
      claimReward: string
      balance: string
      rewards: string
    }
    actions: {
      deposit: string
      withdraw: string
      transfer: string
    }
    settings: {
      profile: string
      security: string
      notifications: string
    }
  }
}

export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`
}[keyof ObjectType & (string | number)]

export type TranslationKey = NestedKeyOf<TranslationKeys> 