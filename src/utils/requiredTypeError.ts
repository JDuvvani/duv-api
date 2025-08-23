export const requiredTypeError = (
  input: any,
  fieldName: string,
  typeName: string
): string => {
  return input === undefined
    ? `${fieldName} is required`
    : `Expected ${fieldName.toLowerCase()} to be of type ${typeName}`;
};
