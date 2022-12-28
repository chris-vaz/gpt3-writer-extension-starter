const generateCompletionAction = async (info) => {
    try {
        const { selectionText } = info;
        const basePromptPrefix = `
      Write me a detailed table of contents for a blog post with the title below.
  
      Title:
      `;
    } catch (error) {
        console.log(error);
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
