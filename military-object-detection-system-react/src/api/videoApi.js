export async function uploadVideo(file) {
    const email = localStorage.getItem('email');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', email );

    try {
        const response = await fetch('http://localhost:5000/process_video', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Video processing failed');
        }

        console.log('Video processing started');
    } catch (error) {
        console.error('Error uploading video:', error);
    }
}


export async function fetchObjectCounts(token) {
    const email = localStorage.getItem('email'); // Витягуємо email з localStorage

    try {
        const response = await fetch(`http://localhost:8080/api/videos/object-counts?email=${email}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`, // Переконайтеся, що токен додається
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch object counts');
        }

        // Парсинг JSON-даних
        return await response.json();
    } catch (error) {
        console.error('Error fetching object counts:', error);
        return [];
    }
}

export async function fetchCountsByEmailAndVideoId(email, videoId, token) {
    try {
        const response = await fetch(`http://localhost:8080/api/videos/counts?email=${email}&videoId=${videoId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch counts by email and video ID');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching counts:', error);
        return [];
    }
}



export async function uploadVideoBackend(file, token) {
    const email = localStorage.getItem('email');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', email );
    try {
        const response = await fetch('http://localhost:8080/api/videos/upload', {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Video processing failed');
        }

        console.log('Video uploaded and saved in DB');
    } catch (error) {
        console.error('Error uploading video:', error);
    }
}

