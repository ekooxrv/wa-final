
function getGroupID(client, message) {
  const groupId = message.chatId;
  client.reply(message.from, `Group ID: ${groupId}`, message.id);
}

module.exports = {
  getGroupID,
};
