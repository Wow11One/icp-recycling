export const generateImageWithDeepAI = async (prompt: string): Promise<string> => {
    try {
        const response = await fetch('https://api.deepai.org/api/text2img', {
            method: 'POST',
            headers: {
                'Api-Key': 'ad0a0898-a97f-4662-8a61-55b002798214',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: prompt }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.err || 'Image generation failed');
        }

        return data['share_url'];
    } catch (error) {
        throw new Error('Image generation failed');
    }
}