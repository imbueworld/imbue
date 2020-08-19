export function snatchNewClassForm(cache) {
    if (!cache.temp) cache.temp = {}
    if (!cache.temp.newClassForm) cache.temp.newClassForm = {}

    return cache.temp.newClassForm
}