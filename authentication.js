'use strict';

const method = {
  type: 'custom',
  // "test" could also be a function
  test: {
    url: 'https://api.chatwork.com/v2/me'
  },
  fields: [
    {
      key: 'api_key',
      type: 'string',
      required: true,
      label: 'Allow Zapier to access your ChatWork Account?',
      helpText: `Follow these steps to find your ChatWork API Key:
      Log into your ChatWork account
      Click on your name in the upper-right corner, and select Personal Settings
      Click on the API section
      Use your ChatWork password to generate/show your API Key
      Copy/paste that API Key into the field below.`
    }
  ]
};

const addApiKeyToHeader = (request, z, bundle) => {
  request.headers['X-ChatWorkToken'] = bundle.authData.api_key;
  return request;
};

module.exports = {
  method,
  addApiKeyToHeader
};
