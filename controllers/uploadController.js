import { uploadToCloudinary } from "../services/upload/fileUpload.js";

export const uploadFile = async(req, res) => {
    try {
        const imageUrls = await uploadToCloudinary(req.files); 
        res.json({ imageUrls });
    } catch (error) {
        console.error("API Upload Error:", error); // Log the error for debugging
        res.status(500).json({ error: error.message || 'Failed to upload images' }); // Send a more user-friendly error message
    }
}