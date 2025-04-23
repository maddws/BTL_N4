const IMGBB_API_KEY = 'f73e4d196b983adeafdd7c033a8bc400';

export async function uploadToImgbb(base64Image: string): Promise<string> {
    const formData = new FormData();
    formData.append('image', base64Image); // Base64 string
    // nếu bạn muốn đặt tên file:
    // formData.append('name', 'my_uploaded_image');

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
    });

    const json = await res.json();
    if (!json.success) {
        throw new Error(`Upload failed: ${JSON.stringify(json)}`);
    }
    // URL thực của ảnh
    return json.data.url as string;
}
