import cache from "./storage/cache"



export function snatchNewClassForm() {
  const cacheObj = cache('temp/newClassForm')
  if (!cacheObj.get()) cacheObj.set({})
  return cacheObj.get()
}