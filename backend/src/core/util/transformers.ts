import { isArrayValue, isNumberValue, isStringValue } from './guards';

export const toNumber = (value: unknown) => {
  if (isStringValue(value)) {
    return Number(value);
  }
  return value as number;
};

export const toBoolean = (value: unknown) => {
  if (isStringValue(value)) {
    return ['true', '1'].includes(value.toLowerCase());
  }
  return Boolean(value);
};

export const toString = (value: unknown) => {
  if (!isStringValue(value)) {
    return String(value);
  }
  return value;
};

export const toDate = (value: unknown) => {
  if (isStringValue(value)) {
    return new Date(isNumberValue(value) ? Number(value) : value);
  } else if (isNumberValue(value)) {
    return new Date(value);
  }
  return value as Date;
};

export const toPipe = <Type>(
  value: unknown,
  transforms: ((item: unknown) => Type)[],
): Type => {
  let result: unknown = value;
  for (const transform of transforms) {
    result = transform(result);
  }
  return result as Type;
};

export const toArrayOf = <Type>(
  value: unknown,
  transform: (item: unknown) => Type,
): Type[] => {
  if (isArrayValue(value)) {
    return value.map((item) => transform(item));
  }
  return [transform(value)];
};

export const toTrimmedString = (value: string) => {
  return toString(value).trim();
};
