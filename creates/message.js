const createMessage = (z, bundle) => {
  z.console.info('Send message', {roomId: bundle.inputData.roomId, message: bundle.inputData.message});
  const responsePromise = z.request({
    method: 'POST',
    url: `https://api.chatwork.com/v2/rooms/${bundle.inputData.roomId}/messages`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    form: { body: bundle.inputData.message }
  });
  return responsePromise
    .then(response => {
      z.console.info(response.content);
      return JSON.parse(response.content);
    });
};

module.exports = {
  key: 'message',
  noun: 'Message',

  display: {
    label: 'Send Message',
    description: 'Actions when a new message mention to you.'
  },

  operation: {
    inputFields: [
      {key: 'roomId', label:'Room ID', required: true},
      {key: 'message', label:'Message', required: true}
    ],
    perform: createMessage
  }
};
