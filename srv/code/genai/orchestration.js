const cds = require('@sap/cds');
const LOG = cds.log('GenAI');

// Configuration object for the LLM, specifying model name and parameters.
const LLM_CONFIG = {
    model_name: 'gpt-4o-mini',
    model_params: {
        max_tokens: 2048,
        temperature: 0.1,
        response_format: {
            type: 'json_object',
        },
    }
};

// System message to set the context for the LLM.
const SYSTEM_MESSAGE = { role: 'system', content: 'You are a support agent for our freezers products' };

// Function to create an orchestration client using the specified prompt.
async function createOrchestrationClient(prompt) {
    const { OrchestrationClient, buildAzureContentFilter } = await import('@sap-ai-sdk/orchestration');
    return new OrchestrationClient({
        llm: LLM_CONFIG,
        templating: {
            template: [
                SYSTEM_MESSAGE,
                { role: 'user', content: prompt }
            ]
        },
        filtering: {
            input: buildAzureContentFilter({ SelfHarm: 0 })
        }
    });
}

// Simple orchestration completion using the LLM, returning a JSON object.
async function orchestrationCompletionSimple(prompt) {
    try {
        const orchestrationClient = await createOrchestrationClient(prompt);
        const response = await orchestrationClient.chatCompletion();
        return JSON.parse(response.getContent());
    } catch (error) {
        LOG.error('Error in orchestration:', error);
        throw new Error('Orchestration service failed.');
    }
}

// Orchestration completion with additional input parameters, returning a JSON object.
async function orchestrationCompletionTemplate(prompt) {
    try {
        const orchestrationClient = await createOrchestrationClient(prompt);
        const response = await orchestrationClient.chatCompletion({
            inputParams: { arg1: '', arg2: "" }
        });
        return JSON.parse(response.getContent());
    } catch (error) {
        LOG.error('Error in orchestration:', error);
        throw new Error('Orchestration service failed.');
    }
}
// Preprocess customer message by categorizing, translating, and summarizing.
// Takes title and full message in customer's language.
// Returns structured JSON with translated title and message, summaries, categories, urgency, and sentiment.

async function preprocessCustomerMassage(titleCustomerLanguage, fullMessageCustomerLanguage) {
    const prompt = `
    Categorize the fullMessageCustomerLanguage into one of (Technical, Delivery, Service). 
    Classify urgency of the fullMessageCustomerLanguage into one of (High, Medium, Low). 
    Classify sentiment of the fullMessageCustomerLanguage into one of (Negative, Positive, Neutral). 
    Translate fullMessageCustomerLanguage to English and put it in fullMessageEnglish.
    Summarize fullMessageCustomerLanguage into 20 words max and keep the original language and put it in summaryCustomerLanguage. 
    Translate the summaryCustomerLanguage to English and put it in summaryEnglish.
    Translate the titleCustomerLanguage to English and put it in titleEnglish. 
    Here is the titleCustomerLanguage and fullMessageCustomerLanguage:
    titleCustomerLanguage: {{?titleCustomerLanguage}}
    fullMessageCustomerLanguage: {{?fullMessageCustomerLanguage}}
    Return the result in the following JSON template:
    {
        fullMessageEnglish: Text,
        titleEnglish: Text, 
        summaryCustomerLanguage: Text, 
        summaryEnglish: Text, 
        messageCategory: Text, 
        messageUrgency: Text, 
        messageSentiment: Text
    }`;

    try {
        const orchestrationClient = await createOrchestrationClient(prompt);
        const response = await orchestrationClient.chatCompletion({
            inputParams: { titleCustomerLanguage, fullMessageCustomerLanguage }
        });
        return JSON.parse(response.getContent());
    } catch (error) {
        LOG.error('Error in preprocessing:', error);
        throw new Error('Preprocessing service failed.');
    }
}

module.exports = {
    preprocessCustomerMassage,
}
