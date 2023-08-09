const webhooks = [""];
 
const title = "", avatarImage = "", shortDescription = "", colour = "#f5a4a0", type = "";
mention = ""
 
 
const bonusFeatures = {
    convert2Link: 'ON', 
    convert2Mention: 'ON' 
}
 
 
const form = FormApp.getActiveForm(), allResponses = form.getResponses(), latestResponse = allResponses[allResponses.length - 1];
let response;
var items = [];
 
try {
    response = latestResponse.getItemResponses()
} catch (error) {
    throw "No Responses found in your form."
}
 
for (const hook of webhooks) {
    if (!/^(?:https?:\/\/)?(?:www\.)?(?:(?:canary|ptb)\.)?discord(?:app)?\.com\/api\/webhooks\/\d+\/[\w-+]+$/i.test(hook)) throw `Webhook ${i + 1 || 1} is not valid.`;
}
 
if (avatarImage && !/\.(jpeg|jpg|gif|png)$/.test(avatarImage)) throw "Image URL is not a direct link";


for (var i = 0; i < response.length; i++) {
    const question = response[i].getItem().getTitle(), answer = response[i].getResponse();
    if (answer == "") continue;
    items.push({ "name": question, "value": answer });

// Фильтр на нужные роли 
    if (answer.includes('Хирург')) {
        mention += '<@&1138852736771833918>';
    }
    if (answer.includes('Психотерапевт')) {
        mention += '<@&1138852819198287872>';
    }
 
    function data(item) {
        const linkValidate = /(?:(?:https?|http?):\/\/)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/i;
 
        if (bonusFeatures.convert2Mention == 'ON' && !isNaN(item.value) && item.value.length == 18) item.value = `<@!${item.value}>`;
 
        if (bonusFeatures.convert2Link == 'ON' && type.toLowerCase() !== 'text') {
            if (linkValidate.test(item.value)) item.value = `[${item.value}](${item.value})`;
        } else {
            if (bonusFeatures.convert2Link == 'ON' && linkValidate.test(item.value)) item.value = `<${item.value}>`;
        }
 
        return [`**${item.name}**`, `${item.value}`].join("\n");
    }
}
 
if (items.map(data).toString().length + shortDescription.length > 1999) throw "Discord limit reached. Please add limits to your questions!";
 
function plainText(e) {
 
    const text = {
        "method": "post",
        "headers": { "Content-Type": "application/json" },
        "muteHttpExceptions": true,
        "payload": JSON.stringify({
            "content": `${mention ? mention : ''}${title ? `**${title}**` : `**${form.getTitle()}**`}\n\n${shortDescription ? `${shortDescription}\n\n${items.map(data).join('\n\n')}` : items.map(data).join('\n\n')}`
        }),
    };
 
    for (var i = 0; i < webhooks.length; i++) { UrlFetchApp.fetch(webhooks[i], text); };
}


 
function embedText(e) {
 

    const embed = {
    "method": "post",
    "headers": { "Content-Type": "application/json" },
    "muteHttpExceptions": true,
    "payload": JSON.stringify({
        "content": mention ? mention : '',
        "embeds": [{
                "title": title ? title : form.getTitle(), // Either the set title or the forms title.
                "description": shortDescription ? `${shortDescription}\n\n${items.map(data).join('\n\n')}` : items.map(data).join('\n\n'), 
                "thumbnail": { url: avatarImage ? encodeURI(avatarImage) : null }, 
                "color": colour ? parseInt(colour.substr(1), 16) : Math.floor(Math.random() * 16777215), 
                "timestamp": new Date().toISOString() 
            }]
        }),
    };
 
    for (var i = 0; i < webhooks.length; i++) { UrlFetchApp.fetch(webhooks[i], embed); };


}
