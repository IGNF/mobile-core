/**
 * Document (file/photo) upload management
 * @migrated from: collaboratif/DocumentForm.js
 * 
 * This is a simplified version focusing on the core API integration.
 * UI-specific logic should be implemented in the consuming application.
 */

import { ApiClient } from 'collaboratif-client-api';

const COLLABORATIVE_DOCUMENT_ADD_ENDPOINT = '/../../document/add';

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

export function isCollaborativeDocumentDraft(value: unknown): value is CollaborativeDocumentDraft {
  if (!value || typeof value !== 'object') {
    return false;
  }

  return (value as CollaborativeDocumentDraft).kind === 'document';
}

function decodeBase64(value: string): ArrayBuffer {
  const binaryString = atob(value);
  const bytes = new Uint8Array(binaryString.length);

  for (let index = 0; index < binaryString.length; index += 1) {
    bytes[index] = binaryString.charCodeAt(index);
  }

  return bytes.buffer as ArrayBuffer;
}

/**
 * Document manager for handling file and photo uploads
 */
export class DocumentManager {
  constructor(private apiClient: ApiClient) {}

  /**
   * Upload a document to a specified URI
   * @param uri - The URI endpoint for upload
   * @param file - The file blob to upload
   * @param filename - The name of the file
   * @param metadata - Optional metadata to attach to the upload
   * @returns The URL of the uploaded document
   */
  async uploadDocument(
    uri: string,
    file: Blob,
    filename: string,
    metadata?: Record<string, any>
  ): Promise<string> {
    const formData = new FormData();
    formData.append('file', file, filename);
    
    if (metadata) {
      for (const [key, value] of Object.entries(metadata)) {
        formData.append(key, String(value));
      }
    }

    const response = await this.apiClient.doRequest(uri, 'post', formData, null, 'multipart/form-data');
    return response.data.url || response.data.path;
  }

  /**
   * Upload a collaborative document draft and return the stored document id.
   */
  async addCollaborativeDocument(file: CollaborativeDocumentDraftFile): Promise<string> {
    const client = this.apiClient as ApiClient & {
      doRequest?: (
        url: string,
        method: string,
        body?: Record<string, unknown> | null,
        params?: Record<string, unknown> | null,
        contentType?: string
      ) => Promise<{ data?: { id?: number | string } }>;
    };

    if (typeof client.doRequest !== 'function') {
      throw new Error('Collaborative client does not support document upload');
    }

    const blob = new Blob(
      [decodeBase64(file.contentBase64)],
      { type: file.mimeType ?? 'application/octet-stream' }
    );

    const response = await client.doRequest(
      COLLABORATIVE_DOCUMENT_ADD_ENDPOINT,
      'post',
      { document: blob },
      null,
      'multipart/form-data'
    );

    const documentId = response?.data?.id;
    if (documentId === null || documentId === undefined || documentId === '') {
      throw new Error('Document upload did not return a document id');
    }

    return String(documentId);
  }

  /**
   * Resolve a collaborative document draft to the value expected by the
   * transaction payload: either a stored document id or null when removed.
   */
  async resolveCollaborativeDocumentValue(value: unknown): Promise<unknown> {
    if (!isCollaborativeDocumentDraft(value)) {
      return value;
    }

    if (value.file) {
      return this.addCollaborativeDocument(value.file);
    }

    return value.removed ? null : value.documentId;
  }

  /**
   * Delete a document by its ID
   * @param documentId - The ID of the document to delete
   */
  async deleteDocument(documentId: number): Promise<void> {
    await this.apiClient.doRequest(`${this.apiClient.getBaseUrl()}/document/${documentId}`, 'delete');
  }

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
  getDocumentUrl(documentId: number): string {
    const baseUrl = this.apiClient.getBaseUrl();
    // TODO: Verify this URL pattern with the collaboratif-client-api documentation
    return `${baseUrl}/document/${documentId}`;
  }
}
