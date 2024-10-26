export function Clamp(number: number, min: number, max: number) {
  return Math.min(Math.max(number, min), max);
}
export const formatNum = (num: number, digits: number = 0) => {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find((item) => num >= item.value);
  return item
    ? (num / item.value).toFixed(digits).replace(regexp, "").concat(item.symbol)
    : "0";
};
// n >= 1000 ? `${(n / 1000).toFixed(toFixedCount)}К` : `${n}`;

export const replaceRegexByArray = function (
  text: string,
  replacements: (string | number)[]
) {
  const regex = /(\%s)/g;
  const _text = text.replace(regex, () => replacements.shift());
  return _text;
};

export const getObjectId = (id: string) => {
  return id === "000000000000000000000000" ? "0" : id;
};

export const getNoun = (
  number: number | undefined,
  one: string,
  two: string,
  five: string
) => {
  if (!number) number = 0;
  let n = Math.abs(number);
  n %= 100;
  if (n >= 5 && n <= 20) {
    return five;
  }
  n %= 10;
  if (n === 1) {
    return one;
  }
  if (n >= 2 && n <= 4) {
    return two;
  }
  return five;
};
