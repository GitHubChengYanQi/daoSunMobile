export const getLastMeasureIndex = (text, prefix) => {
  const prefixList = Array.isArray(prefix) ? prefix : [prefix];
  return prefixList.reduce((lastMatch, prefixStr) => {
      const lastIndex = text.lastIndexOf(prefixStr);
      if (lastIndex > lastMatch.location) {
        return {
          location: lastIndex,
          prefix: prefixStr,
        };
      }
      return lastMatch;
    },
    { location: -1, prefix: '' },
  );
};


