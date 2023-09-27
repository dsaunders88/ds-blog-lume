export function groupTypes(arrayOfObjects, type) {
  const types = new Set();
  arrayOfObjects.map((item) => types.add(item[type]));
  const typesArray = Array.from(types);

  return typesArray.map((item) => {
    return {
      type: item,
      entries: arrayOfObjects.filter((entry) => entry[type] === item),
    };
  });
}

export function sortTypes(arrayOfObjects, sortInstructions) {
  return arrayOfObjects.sort((a, b) => {
    return sortInstructions.indexOf(a.type) - sortInstructions.indexOf(b.type);
  });
}
