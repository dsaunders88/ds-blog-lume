export function splitUrl(url) {
  const arr = url.split("/");
  return arr[arr.length - 2];
}
