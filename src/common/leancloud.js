import AV from 'leancloud-storage';

import { lc } from './../config.js';

try {
  AV.init({...lc});
} catch(error) {
  console.log('Serverless init fail:', error.message);
}

export default AV;

export const getFilter = arg => {
  const args = Array.isArray(arg) ? arg : [arg];
  return args.map(item => ({
    id: item.id,
    ...item.attributes
  }));
}