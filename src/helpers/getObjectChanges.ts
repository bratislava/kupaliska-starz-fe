import { differenceWith, fromPairs, isEqual, toPairs } from "lodash";

export function getObjectChanges<T extends object, K extends object>(obj1: T, obj2: K) {
  return fromPairs(differenceWith(toPairs(obj2), toPairs(obj1), isEqual)) as T & K;
}
