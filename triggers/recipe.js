const status = require('http-status');

const subscribeHook = (z, bundle) => {
  z.console.log('Let subscribe hook!');
  const data = {
    name: bundle.meta.zap.id,
    setting_id: bundle.inputData.settingId,
    event_types: [bundle.inputData.eventTypes],
    token: bundle.inputData.token,
    recipe_endpoint: bundle.targetUrl,
    api_key: bundle.authData.api_key
  };
  const options = {
    url: `${process.env.WEB_HOOK_URL}/web-hooks`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  };
  return z.request(options)
    .then((response) => {
      z.console.info(response.content);
      let content = JSON.parse(response.content);
      if (content.code !== status.OK) {
        throw new Error(content.message);
      }
      let { data } = content;
      return data;
    });
};

const unsubscribeHook = (z, bundle) => {
  const hookId = bundle.subscribeData.id;
  const options = {
    url: `${process.env.WEB_HOOK_URL}/web-hooks/${hookId}`,
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      setting_id: bundle.inputData.settingId
    }
  };
  return z.request(options)
    .then((response) => {
      z.console.info(response.content);
      let content = JSON.parse(response.content);
      if (content.code !== status.OK) {
        throw new Error(content.message);
      }
      return content;
    });
};

const getRecipe = (z, bundle) => {
  const recipe = {
    webhookSettingId: bundle.cleanedRequest.webhookSettingId,
    webhookEventType: bundle.cleanedRequest.webhookEventType,
    webhookEventTime: bundle.cleanedRequest.webhookEventTime,
    webhookEvent: {
      fromAccountId: bundle.cleanedRequest.webhookEvent.fromAccountId,
      fromAccountName: bundle.cleanedRequest.webhookEvent.fromAccountName,
      toAccountId: bundle.cleanedRequest.webhookEvent.toAccountId,
      roomId: bundle.cleanedRequest.webhookEvent.roomId,
      messageId: bundle.cleanedRequest.webhookEvent.messageId,
      body: bundle.cleanedRequest.webhookEvent.body,
      sendTime: bundle.cleanedRequest.webhookEvent.sendTime,
      updateTime: bundle.cleanedRequest.webhookEvent.updateTime
    },
    automatic: {
      repCode: bundle.cleanedRequest.automatic.repCode,
      mainMessage: bundle.cleanedRequest.automatic.mainMessage
    }
  };
  z.console.info(recipe);
  return [recipe];
};

const getFallbackRealRecipe = (z, bundle) => {
  const options = {
    url: `${process.env.WEB_HOOK_URL}/web-hooks/recipes/`,
    params: {
      setting_id: bundle.inputData.settingId,
      token: bundle.inputData.token
    }
  };
  return z.request(options)
    .then((response) => JSON.parse(response.content));
};

// We recommend writing your triggers separate like this and rolling them
// into the App definition at the end.
module.exports = {
  key: 'incoming',
  noun: 'Incoming',
  display: {
    label: 'Incoming Message',
    description: 'Trigger when a new message is created.'
  },
  operation: {
    inputFields: [
      {key: 'settingId', type: 'string', helpText: 'Webhook setting id.', required: true},
      {key: 'token', type: 'string', helpText: 'Webhook token for create HMAC.', required: true},
      {key: 'eventTypes', type: 'string', helpText: 'Select type of event for getting data associated with it.', 'choices': { mention_to_me: 'Mention to me', message_created: 'Message created', message_updated: 'Message updated' }, required: true}
    ],
    type: 'hook',
    performSubscribe: subscribeHook,
    performUnsubscribe: unsubscribeHook,
    perform: getRecipe,
    performList: getFallbackRealRecipe,
    sample: {
      "webhookSettingId": "1000",
      "webhookEventType": "mention_to_me",
      "webhookEventTime": 1551079491,
      "webhookEvent": {
        "fromAccountId": 0,
        "fromAccountName": "Human",
        "toAccountId": 1,
        "roomId": 139898771,
        "messageId": "1151780587908890624",
        "body": "[To: 1] Autobot\nHello, How are you to day",
        "sendTime": 1551079491,
        "updateTime": 0
      },
      "automatic": {
        "repCode": "[rp aid=0 to=139898771-1151780587908890624] Human",
        "mainMessage": "Hello, How are you to day"
      }
    },

    // If the resource can have fields that are custom on a per-user basis, define a function to fetch the custom
    // field definitions. The result will be used to augment the sample.
    // outputFields: () => { return []; }
    // Alternatively, a static field definition should be provided, to specify labels for the fields
    outputFields: [
      {key: 'webhookSettingId', label: 'Setting Id'},
      {key: 'webhookEventType', label: 'Event Type'},
      {key: 'webhookEventTime', label: 'Event Time'},
      {key: 'webhookEvent', label: 'Webhook Event'},
      {key: 'webhookEvent__fromAccountId', label: 'From Acount Id'},
      {key: 'webhookEvent__fromAccountName', label: 'From Acount Name'},
      {key: 'webhookEvent__toAccountId', label: 'To Acount Id'},
      {key: 'webhookEvent__roomId', label: 'Room Id'},
      {key: 'webhookEvent__messageId', label: 'Message Id'},
      {key: 'webhookEvent__body', label: 'Body'},
      {key: 'webhookEvent__sendTime', label: 'Send Time'},
      {key: 'webhookEvent__updateTime', label: 'Update Time'},
      {key: 'automatic__repCode', label: 'Reply Code'},
      {key: 'automatic__mainMessage', label: 'Main Message'},
    ]
  }
};
