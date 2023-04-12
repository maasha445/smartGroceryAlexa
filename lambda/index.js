/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const { AttributesManager } = require('ask-sdk-core');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome to smart grocery genius. what can i do for you today?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        
       const speakOutput= "hello world";

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


//Check Inventory
const checkInventoryIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'checkInventory';
    },
    handle(handlerInput) {
        
        const listType = Alexa.getSlotValue(handlerInput.requestEnvelope, 'listType');
            if (listType && listType.toLowerCase() === 'regular grocery') {
                
     
        // code to retrieve regular inventory information and generate response
        const inventory = retrieveRegularGroceryInventory();
        const speakOutput = `You currently have ${inventory.milk} units of milk, ${inventory.butter} units of butter, and ${inventory.egg} units of eggs in stock.`;


        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    } else {
        
        // code to retrieve party inventory information and generate response
        const inventory = retrievePartyGroceryInventory();
        const speakOutput = `You currently have ${inventory.cake} units of cake, ${inventory.balloon} units of balloon, and ${inventory.icing} units of icing in stock.`;


        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
        }
        
    }
};




// code to retrieve regular inventory information
function retrieveRegularGroceryInventory() {
  
     const fs = require('fs');
    // retrieve inventory data from json file
     const items = JSON.parse(fs.readFileSync('data/items.json', 'utf8'));
     // const itemList = Object.values(items).join(', ');
     return items;
}

// code to retrieve party inventory information
function retrievePartyGroceryInventory() {
  
     const fs = require('fs');
    // retrieve inventory data from json file
     const items = JSON.parse(fs.readFileSync('data/partyItems.json', 'utf8'));
     // const itemList = Object.values(items).join(', ');
     return items;
}


//place order
const placeOrderIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'placeOrder';
    },
    handle(handlerInput) {
        
        // get the item and quantity from the intent slots
        const itemSlot = Alexa.getSlot(handlerInput.requestEnvelope, 'item');
        const quantitySlot = Alexa.getSlot(handlerInput.requestEnvelope, 'quantity');
        const item = itemSlot.value;
        const quantity = quantitySlot.value;
        
        // code to place the order
        const order = placeOrder(item, quantity);
        
        // store the order details as session attributes
        const attributesManager = handlerInput.attributesManager;
        const sessionAttributes = {
            orderNumber: order.orderNumber,
            item: order.item,
            quantity: order.quantity
        };
        attributesManager.setSessionAttributes(sessionAttributes);
        
        const speechText = `Your order of ${quantity} units of ${item} has been placed. Your order number is ${order.orderNumber}.`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

// code to place the order
function placeOrder(item, quantity) {
    // code to interact with your order system (database, external API, etc.)
    const order = { orderNumber: '123', item: item, quantity: quantity };
    return order;
}

//cancel order
const cancelOrderIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'cancelOrder';
    },
    handle(handlerInput) {
        
       // get the session attributes
        const attributesManager = handlerInput.attributesManager;
        const sessionAttributes = attributesManager.getSessionAttributes();
        
        // check if the order number is available in the session attributes
        if (!sessionAttributes.hasOwnProperty('orderNumber')) {
            const speechText = 'You have not placed any order, Please place an order first';
            return handlerInput.responseBuilder
                .speak(speechText)
                .getResponse();
        }
        
        // code to cancel the order
        const orderNumber = sessionAttributes.orderNumber;
        const result = cancelOrder(orderNumber);
        
        // remove the order details from session attributes
        attributesManager.setSessionAttributes({});
        
        const speechText = `Your order with order number ${orderNumber} has been canceled. ${result.message}`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};

// code to cancel the order
function cancelOrder(orderNumber) {
    // code to interact with your order system (database, external API, etc.)
    const result = { message: 'Your refund will be processed soon' };
    return result;
}


//Nutritional information
const nutritionalInfoIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'nutritionalInfo';
    },
    handle(handlerInput) {
        
        const itemName = Alexa.getSlotValue(handlerInput.requestEnvelope, 'itemName');
        // Code to fetch nutritional information for the given item name
        const nutritionalInfo = "serving size: 1 cup (240mL),Calories: 30, Fat: 1g, Carbohydrates: 7g, Protein: 1g";
        const speechText = `The nutritional information for ${itemName} is ${nutritionalInfo}.`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

//Recipe Suggestion
const recipeSuggetionsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'recipeSuggetions';
    },
    handle(handlerInput) {
        
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const inventory = sessionAttributes.inventory || {};
        let items = Object.keys(inventory);
        if (!items.length) {
            items = "eggs, Spaghetti, slamon, chicken";
        }
        // code to get recipe suggestions based on items in the inventory
        let recipe = "Spaghetti with meatballs, Grilled chicken Caesar salad, Baked salmon with lemon and herbs"
        let speechText = `available items in your inventory :${items}. Here are some recipe suggestions based on the items in your inventory:  ${recipe}`;
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};


const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelloWorldIntentHandler,
        checkInventoryIntentHandler,
        placeOrderIntentHandler,
        recipeSuggetionsIntentHandler,
        cancelOrderIntentHandler,
        nutritionalInfoIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();