

export async function uploadImage(file) {
    const email = localStorage.getItem('email');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', email );

    try {
        const response = await fetch('http://localhost:5000/process_image', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Image processing failed');
        }

        console.log('Image processing started');
    } catch (error) {
        console.error('Error uploading image:', error);
    }
}


// export async function fetchCountsByEmailAndImageId(email, videoId, token) {
//     try {
//         const response = await fetch(`http://localhost:8080/api/videos/counts?email=${email}&videoId=${videoId}`, {
//             method: 'GET',
//             headers: {
//                 Authorization: `Bearer ${token}`,
//                 'Content-Type': 'application/json',
//             },
//         });
//
//         if (!response.ok) {
//             throw new Error('Failed to fetch counts by email and video ID');
//         }
//
//         return await response.json();
//     } catch (error) {
//         console.error('Error fetching counts:', error);
//         return [];
//     }
// }



export async function uploadImageBackend(file, token) {
    const email = localStorage.getItem('email');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', email );
    try {
        const response = await fetch('http://localhost:8080/api/images/upload', {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Image processing failed');
        }

        console.log('Image uploaded and saved in DB');
    } catch (error) {
        console.error('Error uploading image:', error);
    }
}

