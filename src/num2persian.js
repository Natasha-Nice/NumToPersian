/**
 * @type {string}
 */
const delimiter = ' و ';

/**
 * @type {string}
 */
const zero = 'صفر';

/**
 * @type {string}
 */
const negative = 'منفی ';

/**
 * @type {*[]}
 */
const letters = [
  ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'],
  ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده', 'بیست'],
  ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'],
  ['', 'یکصد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'],
  ['', ' هزار', ' میلیون', ' میلیارد', ' بیلیون', ' بیلیارد', ' تریلیون', ' تریلیارد',
    ' کوآدریلیون', ' کادریلیارد', ' کوینتیلیون', ' کوانتینیارد', ' سکستیلیون', ' سکستیلیارد', ' سپتیلیون',
    ' سپتیلیارد', ' اکتیلیون', ' اکتیلیارد', ' نانیلیون', ' نانیلیارد', ' دسیلیون', ' دسیلیارد'
  ],
];

/**
 * Decimal suffixes for decimal part
 * @type {string[]}
 */
const decimalSuffixes = [
  '',
  'دهم',
  'صدم',
  'هزارم',
  'ده‌هزارم',
  'صد‌هزارم',
  'میلیونوم',
  'ده‌میلیونوم',
  'صدمیلیونوم',
  'میلیاردم',
  'ده‌میلیاردم',
  'صد‌‌میلیاردم'
];

/**
 * Clear number and split to 3 sections
 * @param {*} num
 */
const prepareNumber = (num) => {
  let out = num;
  if (typeof out === 'number') {
    out = out.toString();
  }

  // make first part 3 chars
  if (out.length % 3 === 1) {
    out = `00${out}`;
  } else if (out.length % 3 === 2) {
    out = `0${out}`;
  }
  // Explode to array
  return out.replace(/\d{3}(?=\d)/g, '$&*').split('*');
};

/**
 * Convert a fractional part to word (e.g., 1/2 -> "نیم")
 * @param fraction
 * @returns {string}
 */
const convertFraction = (fraction) => {
  const fractions = {
    '1/2': 'نیم',
    '1/3': 'یک سوم',
    '2/3': 'دو سوم',
    '1/4': 'یک چهارم',
    '3/4': 'سه چهارم',
    '1/5': 'یک پنجم',
    '2/5': 'دو پنجم',
    '3/5': 'سه پنجم',
    '4/5': 'چهار پنجم',
    '1/6': 'یک ششم',
    '5/6': 'پنج ششم',
    '1/7': 'یک هفتم',
    '6/7': 'شش هفتم',
    '1/8': 'یک هشتم',
    '7/8': 'هفت هشتم',
    '1/9': 'یک نهم',
    '2/9': 'دو نهم',
    // Add more fractions if necessary
  };

  return fractions[fraction] || fraction;
};

//tinyNumToWord convert 3tiny parts to word
const tinyNumToWord = (num) => {
  if (parseInt(num, 0) === 0) {
    return '';
  }
  const parsedInt = parseInt(num, 0);
  if (parsedInt < 10) {
    return letters[0][parsedInt];
  }
  if (parsedInt <= 20) {
    return letters[1][parsedInt - 10];
  }
  if (parsedInt < 100) {
    const one = parsedInt % 10;
    const ten = (parsedInt - one) / 10;
    if (one > 0) {
      return letters[2][ten] + delimiter + letters[0][one];
    }
    return letters[2][ten];
  }
  const one = parsedInt % 10;
  const hundreds = (parsedInt - (parsedInt % 100)) / 100;
  const ten = (parsedInt - ((hundreds * 100) + one)) / 10;
  const out = [letters[3][hundreds]];
  const secondPart = ((ten * 10) + one);

  if (secondPart === 0) {
    return out.join(delimiter);
  }

  if (secondPart < 10) {
    out.push(letters[0][secondPart]);
  } else if (secondPart <= 20) {
    out.push(letters[1][secondPart - 10]);
  } else {
    out.push(letters[2][ten]);
    if (one > 0) {
      out.push(letters[0][one]);
    }
  }

  return out.join(delimiter);
};

/**
 * Convert Decimal part
 * @param decimalPart
 * @returns {string}
 * @constructor
 */
const convertDecimalPart = (decimalPart) => {
  // Clear right zero
  decimalPart = decimalPart.replace(/0*$/, "");

  if (decimalPart === '') {
    return '';
  }

  if (decimalPart.length > 11) {
    decimalPart = decimalPart.substr(0, 11);
  }
  return ' ممیز ' + Num2persian(decimalPart) + ' ' + decimalSuffixes[decimalPart.length];
};

/**
 * Main function
 * @param input
 * @returns {string}
 * @constructor
 */
const Num2persian = (input) => {
  // Check if input is a fraction
  if (input.includes('/')) {
    return convertFraction(input);
  }

  // Clear Non digits
  input = input.toString().replace(/[^0-9.,-]/g, ''); // Added support for commas and periods
  let isNegative = false;
  const floatParse = parseFloat(input);

  // Return zero if this isn't a valid number
  if (isNaN(floatParse)) {
    return zero;
  }

  // Check for zero
  if (floatParse === 0){
    return zero;
  }

  // Set negative flag:true if the number is less than 0
  if (floatParse < 0){
    isNegative = true;
    input = input.replace(/-/g, '');
  }

  // Declare Parts
  let decimalPart = '';
  let integerPart = input;
  let pointIndex = input.indexOf('.');
  
  // Support for comma as a decimal separator (European style)
  if (pointIndex === -1) {
    pointIndex = input.indexOf(',');
    if (pointIndex > -1) {
      input = input.replace(',', '.');
    }
  }

  // Check for float numbers form string and split Int/Dec
  if (pointIndex > -1) {
    integerPart = input.substring(0, pointIndex);
    decimalPart = input.substring(pointIndex + 1, input.length);
  }

  if (integerPart.length > 66) {
    return 'خارج از محدوده';
  }

  // Split to sections
  const slicedNumber = prepareNumber(integerPart);
  
  // Fetch Sections and convert
  const out = [];
  for (let i = 0; i < slicedNumber.length; i++) {
    const converted = tinyNumToWord(slicedNumber[i]);
    if (converted !== '') {
      out.push(converted + letters[4][slicedNumber.length - (i + 1)]);
    }
  }

  // Convert Decimal part
  if (decimalPart.length > 0) {
    decimalPart = convertDecimalPart(decimalPart);
  }

  return (isNegative ? negative : '') + out.join(delimiter) + decimalPart;
};

//@deprecated
String.prototype.toPersianLetter = function () {
  return Num2persian(this);
};

//@deprecated
Number.prototype.toPersianLetter = function () {
  return Num2persian(parseFloat(this).toString());
};

String.prototype.num2persian = function () {
  return Num2persian(this);
};

Number.prototype.num2persian = function () {
  return Num2persian(parseFloat(this).toString());
};

export default Num2persian;
