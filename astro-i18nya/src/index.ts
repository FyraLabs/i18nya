import { I18Nya } from 'i18nya';

export const genGetStaticPaths = ({ translations, config }: I18Nya) => async () => Object.keys(translations)
    .filter((lang) => lang !== config.defaultLang)
    .map((lang) => ({ params: { lang: lang } }));

