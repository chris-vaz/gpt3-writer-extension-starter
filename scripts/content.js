// So we are sending messages, but we don't have anything receiving
// it. It's like you're screaming at the top of your lungs in a forest
// , but no one is there to listen.

// Since we want our UI to recieve the message we should setup
// a listener over there. In order for us to do that, we need
// to create a file that handles scripts for us on the UI side. That's where
// content.js file comes in

// This file will hold all of our scripts for the frontend of 
// of our extension, such as DOM manipulation. 
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'inject') {
        const { content } = request;

        console.log(content);

        sendResponse({ status: 'success' });
    }
});