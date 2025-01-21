const avatarRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

const validateURL = (url: string) => avatarRegex.test(url);

export default validateURL;

// TODO: написать тесты
// const testURLs = [
//   'http://ya.ru', // true
//   'https://www.ya.ru', // true
//   'http://2-domains.ru', // true
//   'http://ya.ru/path/to/deep/', // true
//   'http://ya-ya-ya.ru', // true
//   'http://ya', // false
//   'https://www.ya', // false
// ];

// testURLs.forEach((url) => {
//   console.log(`${url}: ${avatarRegex.test(url)}`);
// });
