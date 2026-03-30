/**
 * Document (file/photo) upload management
 * @migrated from: collaboratif/DocumentForm.js
 *
 * This is a simplified version focusing on the core API integration.
 * UI-specific logic should be implemented in the consuming application.
 */
import { ApiClient } from 'collaboratif-client-api';
export interface CollaborativeDocumentDraftFile {
    name: string;
    mimeType?: string | null;
    contentBase64: string;
}
export interface CollaborativeDocumentDraft {
    kind: 'document';
    documentId: string | null;
    file: CollaborativeDocumentDraftFile | null;
    removed: boolean;
}
export declare function isCollaborativeDocumentDraft(value: unknown): value is CollaborativeDocumentDraft;
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
     * Upload a collaborative document draft and return the stored document id.
     */
    addCollaborativeDocument(file: CollaborativeDocumentDraftFile): Promise<string>;
    /**
     * Resolve a collaborative document draft to the value expected by the
     * transaction payload: either a stored document id or null when removed.
     */
    resolveCollaborativeDocumentValue(value: unknown): Promise<unknown>;
    /**
     * Delete a document by its ID
     * @param documentId - The ID of the document to delete
     */
    deleteDocument(documentId: number): Promise<void>;
    /**
     * Get the URL of a document by its ID
     * @param documentId - The ID of the document
     * @returns The URL of the document
     *
     * Note: The exact URL pattern depends on the API server configuration.
     * Common patterns are:
     * - ${baseUrl}/document/${documentId}
     * - ${baseUrl}/documents/${documentId}
     * - ${baseUrl}/api/v1/documents/${documentId}
     *
     * This should be verified against the actual API documentation.
     */
    getDocumentUrl(documentId: number): string;
}
//# sourceMappingURL=DocumentManager.d.ts.map