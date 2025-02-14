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

        if (download) {
            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(
                new Blob([blob], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                })
            );
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = 'ТКП.xlsx';
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } else {
            return await response.json();
        }
    }
}