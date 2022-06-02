import LocalizedStrings from 'react-native-localization';

import english from './lang/en';
import turkish from './lang/tr';

const strings = new LocalizedStrings({
  en: english,
  tr: turkish,
});

export default strings;