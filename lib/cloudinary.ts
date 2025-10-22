import { v2 as cloudinary } from "cloudinary"

// Cloudinary configuration with fallback values
const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dwb0rfpit",
  api_key: process.env.CLOUDINARY_API_KEY || "594724761565335",
  api_secret: process.env.CLOUDINARY_API_SECRET || "1Sp3ojZAuwVftiPMv3I-y_YXz4c",
}

cloudinary.config(cloudinaryConfig)

export async function uploadImage(file: File, folder = "blog") {
  try {
    // Validate Cloudinary configuration
    if (!cloudinaryConfig.cloud_name || !cloudinaryConfig.api_key || !cloudinaryConfig.api_secret) {
      throw new Error("Cloudinary configuration is incomplete. Please check your environment variables.")
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: `blog-cms/${folder}`,
            resource_type: "auto",
            transformation: [{ quality: "auto:good" }, { fetch_format: "auto" }],
          },
          (error: any, result: any) => {
            if (error) {
              console.error("Cloudinary upload error:", error)
              reject(new Error(`Upload failed: ${error.message}`))
            } else {
              resolve(result)
            }
          },
        )
        .end(buffer)
    })
  } catch (error) {
    console.error("Cloudinary upload error:", error)
    throw error instanceof Error ? error : new Error("Image upload failed")
  }
}

export async function deleteImage(publicId: string) {
  try {
    // Validate Cloudinary configuration
    if (!cloudinaryConfig.cloud_name || !cloudinaryConfig.api_key || !cloudinaryConfig.api_secret) {
      throw new Error("Cloudinary configuration is incomplete. Please check your environment variables.")
    }

    const result = await cloudinary.uploader.destroy(publicId)
    return result
  } catch (error) {
    console.error("Cloudinary delete error:", error)
    throw error instanceof Error ? error : new Error("Image deletion failed")
  }
}
export default cloudinary

