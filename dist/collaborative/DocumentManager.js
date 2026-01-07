/**
 * Document (file/photo) upload management
 * @migrated from: collaboratif/DocumentForm.js
 *
 * This is a simplified version focusing on the core API integration.
 * UI-specific logic should be implemented in the consuming application.
 */
/**
 * Document manager for handling file and photo uploads
 */
export class DocumentManager {
    constructor(apiClient) {
        this.apiClient = apiClient;
    }
    /**
     * Upload a document to a specified URI
     * @param uri - The URI endpoint for upload
     * @param file - The file blob to upload
     * @param filename - The name of the file
     * @param metadata - Optional metadata to attach to the upload
     * @returns The URL of the uploaded document
     */
    async uploadDocument(uri, file, filename, metadata) {
        const formData = new FormData();
        formData.append('file', file, filename);
        if (metadata) {
            for (const [key, value] of Object.entries(metadata)) {
                formData.append(key, String(value));
            }
        }
        const response = await this.apiClient.uploadFile(uri, formData);
        return response.data.url || response.data.path;
    }
    /**
     * Delete a document by its ID
     * @param documentId - The ID of the document to delete
     */
    async deleteDocument(documentId) {
        await this.apiClient.deleteDocument(documentId);
    }
    /**
     * Get the URL of a document by its ID
     * @param documentId - The ID of the document
     * @returns The URL of the document
     */
    async getDocumentUrl(documentId) {
        const response = await this.apiClient.getDocument(documentId.toString());
        return response.data.url;
    }
}
//# sourceMappingURL=DocumentManager.js.map