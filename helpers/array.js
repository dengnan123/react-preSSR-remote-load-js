

export const deduplicationArr = (arr, key) => {
  const hash = {}
  return arr.reduce((pre, next) => {
    const hashKey = next[key]
    if (!hash[hashKey]) {
      hash[hashKey] = 1
      return [...pre, next]
    }
    return pre
  }, [])
}
