export default class Api {
    static async get(url) {
        const response = await fetch(url);
        return await response.json();
    }

    static async post(url, body, download = false) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // if (download) {
        //     try {
        //         const blob = await response.blob();
        //         // Check if blob is not empty
        //         if (blob.size > 0) {
        //             const downloadUrl = window.URL.createObjectURL(blob);
        //             const link = document.createElement('a');
        //             link.href = downloadUrl;
        //             link.download = 'ТКП.xlsx';
        //             document.body.appendChild(link);
        //             link.click();
        //             link.remove();
        //             window.URL.revokeObjectURL(downloadUrl);
        //         } else {
        //             throw new Error('Downloaded file is empty');
        //         }
        //     } catch (error) {
        //         console.error('Download failed:', error);
        //         throw new Error('Failed to download file');
        //     }
        // } else
        return await response.json();
    }
}