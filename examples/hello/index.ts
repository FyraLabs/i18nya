import { init } from '../../src/index';
init({ defaultLang: 'en', langDir: './langs' }).then(({ makeT }) => {
  console.log(makeT("en")("hello"));
});
