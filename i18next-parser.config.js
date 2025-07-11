module.exports = {
    contextSeparator: '_',
  
    createOldCatalogs: true,
  
    defaultNamespace: 'translation',
  
    defaultValue: '',
  
    indentation: 2,
  
    keepRemoved: false,
  
    keySeparator: false,
  
    lexers: {
      hbs: ['HandlebarsLexer'],
      handlebars: ['HandlebarsLexer'],
  
      htm: ['HTMLLexer'],
      html: ['HTMLLexer'],
  
      mjs: ['JavascriptLexer'],
      js: ['JavascriptLexer'],
      ts: ['JavascriptLexer'],
      jsx: ['JsxLexer'],
      tsx: ['JsxLexer'],
  
      default: ['JavascriptLexer'],
    },
  
    lineEnding: 'auto',
  
    locales: ['en-US', 'zh-CN'],
  
    namespaceSeparator: false,
  
    output: 'src/i18n/locales/translations/$LOCALE.json',
  
    pluralSeparator: '_',
  
    input: ['src/**/*.tsx', 'src/**/*.ts'],
  
    sort: true,
  
    verbose: false,
  
    failOnWarnings: false,
  
    customValueTemplate: null,
  }