/**
 * Document (file/photo) upload management
 * @migrated from: collaboratif/DocumentForm.js
 *
 * This is a simplified version focusing on the core API integration.
 * UI-specific logic should be implemented in the consuming application.
 */
import { ApiClient } from 'collaboratif-client-api';
/**
 * Document manager for handling file and photo uploads
 */
export declare class DocumentManager {
    private apiClient;
    constructor(apiClient: ApiClient);
    /**
     * Upload a document to a specified URI
     * @param uri - The URI endpoint for upload
     * @param file - The file blob to upload
     * @param filename - The name of the file
     * @param metadata - Optional metadata to attach to the upload
     * @returns The URL of the uploaded document
     */
    uploadDocument(uri: string, file: Blob, filename: string, metadata?: Record<string, any>): Promise<string>;
    /**
     * Delete a document by its ID
     * @param documentId - The ID of the document to delete
     */
    deleteDocument(documentId: number): Promise<void>;
    /**
     * Get the URL of a document by its ID
     * @param documentId - The ID of the document
     * @returns The URL of the document
     */
    getDocumentUrl(documentId: number): Promise<string>;
}
//# sourceMappingURL=DocumentManager.d.ts.map