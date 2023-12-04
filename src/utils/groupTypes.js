import { sortBy } from "https://deno.land/std@0.208.0/collections/mod.ts";

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

export function sortByProperty(arrayOfObjects, type, direction = "asc") {
  return sortBy(arrayOfObjects, (item) => item[type], { order: direction });
}
