// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export enum dictionaries {
  MAINDB = 0,
  CHEMICDB,
  COMPUTDB,
  LEGALDB,
  MEDICDB,
  TECHNIDB,
  TRADEDB,
  PROVERBDB
};

export const environment = {
  production: false,

  
  API_IP: 'api.euroglot.nl',
  //API_IP: '10.78.75.3',
  //API_IP: 'localhost',
  PORTS_DICTIONARY: '2345,2351,2352,2353,2354,2355,2356,2357',
  PORTS_CONJUGATIONS: '2348,2371,2372,2373,2374,2375,2376,2377',
  PORT_RESOURCE: '2347',
  PORT_SOUFFLEUR: '2349',
  PORT_AUTH: '2350',
  PORT_MERGE: '2344',
  PORT_CONFIG: '2343',
  DB_NAMES: "maindb,chemicdb,computdb,legaldb,medicdb,technidb,tradedb,proverbdb",
  ENDPOINT_MERGE: '/dictionaries',
  ENDPOINT_DICTIONARY: '/dictionary',
  ENDPOINT_CONJUGATION: '/conjugations',
  ENDPOINT_RESOURCE: '/resource',
  ENDPOINT_SOUFFLEUR: '/souffleur',
  ENDPOINT_AUTH: '/authenticate',
  ENDPOINT_CONFIG: '/configuration',
  CONFIG:'/config/',
  RESET_PASSWORD_EGO:'/reset_ego_password/',
  RESET_PASSWORD_EGO_MAILLINK:'http://www.euroglotonline.nl/beta/forgot-password?user=<!--USER-->&hash=<!--HASH-->',
  TRANSLATE:'/translate/',
  TRANSLATES: '/translates/',
  THESAURUS: '/thesaurus/',
  FORMS: '/forms/',
  TRANSLATED_FORMS: '/translations/',  
  SURROUNDINGS: '/surround/',
  RESOURCE: '/resource/',
  WORDTYPE: '/word_type/',
  SOUFFLEUR: '/souffleur/',
  CONCEPTS: '/concepts/',
  RESOURCE_ARGS: '',
  ATTRIBUTE: '/attribute/',
  ATTRIBUTE_ARGS: '',
  ATTRIBUTES: '/attributes/',
  ATTRIBUTES_ARGS: '',
  TRANSLATE_ARGS: 'count=4&full_data',
  THESAURUS_ARGS: 'full_data',
  SURROUNDINGS_ARGS: 'count=4',
  REFERENCE_ARGS: 'with_references',
  LOCAL_RECURSE: 'local_recurse',
  ALL_RECURSE: 'recurse',
  CASE_INSENSITIVE: 'case_insensitive',
  HIDE_DOUBLE_ALTERNATIVES: 'hide_double_alternatives',
  DIACRITIC_INSENSITIVE: 'diacritic_insensitive'
};