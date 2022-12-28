//Function to get + decode API key
const getKey = () => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['openai-key'], (result) => {
            if (result['openai-key']) {
                const decodedKey = atob(result['openai-key']);
                resolve(decodedKey);
            }
        });
    });
};

//This sendMessage block of code below is doing a few things - 
// 1. First, we're looking for which tab is currently active. In order to 
// send a message we need to do it in an active tab
// 2. We then use a fancy sendMessage function given to us from chrome. This 
// takes 3 things - tab, payload and callback. Our payload is going to include a message called inject and the 
// content of whatever we have passed in
// 3. Finally our message will respond with a status, to let us know things are working well

const sendMessage = (content) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0].id;

        chrome.tabs.sendMessage(
            activeTab,
            { message: 'inject', content },
            (response) => {
                if (response.status === 'failed') {
                    console.log('injection failed.');
                }
            }
        );
    });
};


const generate = async (prompt) => {
    //Get my API key from storage
    const key = await getKey();
    const url = 'https://api.openai.com/v1/completions';

    //Call completions endpoint
    const completionResponse = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
            model: 'text-davinci-003',
            prompt: prompt,
            max_tokens: 1250,
            temperature: 0.7,
        }),
    });

    //Select the top choice and send back
    const completion = await completionResponse.json();
    return completion.choices.pop();
}

const generateCompletionAction = async (info) => {
    try {

        // Send mesage with generating text (this will be like a loading indicator)
        sendMessage('generating...');

        const { selectionText } = info;
        const basePromptPrefix = ` Please provide personalized advice or guidance on 
        how to improve mental health or well-being, 
        based on your professional experience as a therapist or 
        psychologist: `;

        const baseCompletion = await generate(`${basePromptPrefix}${selectionText}`);
        // console.log(baseCompletion.text)

        const secondPrompt = ` Also, don't recommend visiting a psychologist 
        but rather provide personalized 
        advice.`;

        //Calling my second prompt
        const secondPromptCompletion = await generate(secondPrompt);
        // Send the output when we're all done
        sendMessage(secondPromptCompletion.text);
    } catch (error) {
        console.log(error);
        // Add this here as well to see if we run into any errors!
        sendMessage(error.toString());
    }
};

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'context-run',
        title: 'Generate therapy advice',
        contexts: ['selection'],
    });
});


chrome.contextMenus.onClicked.addListener(generateCompletionAction);
