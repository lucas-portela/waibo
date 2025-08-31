export const isStringValue = (value: unknown): value is string => {
  return typeof value === 'string' || value instanceof String;
};

export const isNumberValue = (value: unknown): value is number => {
  return (
    (typeof value === 'number' && !isNaN(value)) ||
    (isStringValue(value) && !isNaN(Number(value)))
  );
};

export const isBooleanValue = (value: unknown): value is boolean => {
  return (
    typeof value === 'boolean' ||
    (isStringValue(value) && ['true', 'false', '0', '1'].includes(value)) ||
    (isNumberValue(value) && [0, 1].includes(value))
  );
};

export const isDateValue = (value: unknown): value is Date => {
  return (
    !isEmptyValue(value) &&
    (value instanceof Date ||
      (isStringValue(value) && !isNaN(Date.parse(value))) ||
      (isNumberValue(value) && !isNaN(new Date(value).getTime())))
  );
};

export const isArrayValue = <Type>(value: unknown): value is Array<Type> => {
  return !isEmptyValue(value) && Array.isArray(value);
};

export const isEmptyValue = (value: unknown): boolean => {
  if (value === null || value === undefined) return true;
  if (isStringValue(value) && value.trim() === '') return true;
  if (isArrayValue(value) && value.length === 0) return true;
  if (typeof value === 'object' && Object.keys(value).length === 0) return true;
  return false;
};

export const isUndefinedOrNullValue = (
  value: unknown,
): value is null | undefined => {
  return value === undefined || value === null;
};

export const isOneOfValues = <Type>(
  value: unknown,
  validValues: Array<Type>,
): value is Type[keyof Type] => {
  return !isEmptyValue(value) && validValues.includes(value as Type);
};
