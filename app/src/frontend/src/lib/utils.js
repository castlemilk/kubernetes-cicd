export const setConfig = (window, windowValue, defaultValue) => {
  if (window["_env_"]) {
    if (window["_env_"][windowValue]) {
      return window["_env_"][windowValue]
    } else {
      return defaultValue
    }
  }
  return defaultValue
}