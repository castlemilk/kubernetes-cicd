export const setConfig = (window, windowValue, defaultValue) => {
  if (window["__ENV__"]) {
    if (window["__ENV__"][windowValue]) {
      return window["__ENV__"][windowValue]
    } else {
      return defaultValue
    }
  }
  return defaultValue
}