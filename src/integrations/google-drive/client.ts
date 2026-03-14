import { GoogleDriveConfig, DriveFile, DriveFolder, UploadFileRequest, CreateFolderRequest, DriveSearchResult, DriveQuota } from './types';

class GoogleDriveClient {
  private config: GoogleDriveConfig | null = null;
  private readonly API_BASE = 'https://www.googleapis.com/drive/v3';
  private readonly UPLOAD_BASE = 'https://www.googleapis.com/upload/drive/v3';

  constructor(config?: GoogleDriveConfig) {
    if (config) {
      this.config = config;
    }
  }

  setConfig(config: GoogleDriveConfig) {
    this.config = config;
  }

  private getHeaders(): HeadersInit {
    if (!this.config) {
      throw new Error('Google Drive not configured');
    }

    return {
      'Authorization': `Bearer ${this.config.accessToken}`,
    };
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    if (!this.config) {
      throw new Error('Google Drive not configured');
    }

    const url = `${this.API_BASE}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Google Drive API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      await this.request('/about?fields=user');
      return true;
    } catch {
      return false;
    }
  }

  // Get user info
  async getUserInfo() {
    return this.request('/about?fields=user,storageQuota');
  }

  // Get storage quota
  async getStorageQuota(): Promise<DriveQuota> {
    const response = await this.request<{ storageQuota: DriveQuota }>('/about?fields=storageQuota');
    return response.storageQuota;
  }

  // Search files
  async searchFiles(query: string, pageSize = 20): Promise<DriveSearchResult> {
    const response = await this.request<{
      files: DriveFile[];
      nextPageToken?: string;
    }>(`/files?q=${encodeURIComponent(query)}&pageSize=${pageSize}&fields=files(id,name,mimeType,description,size,createdTime,modifiedTime,webViewLink,webContentLink,thumbnailLink,parents,owners)`);
    
    return {
      files: response.files,
      nextPageToken: response.nextPageToken,
    };
  }

  // Get file by ID
  async getFile(fileId: string): Promise<DriveFile> {
    return this.request(`/files/${fileId}?fields=id,name,mimeType,description,size,createdTime,modifiedTime,webViewLink,webContentLink,thumbnailLink,parents,owners,permissions`);
  }

  // Get folder contents
  async getFolderContents(folderId: string): Promise<DriveFile[]> {
    const query = folderId === 'root' 
      ? "'root' in parents and trashed = false"
      : `'${folderId}' in parents and trashed = false`;
    
    const response = await this.searchFiles(query, 100);
    return response.files;
  }

  // Create folder
  async createFolder(request: CreateFolderRequest): Promise<DriveFolder> {
    const metadata = {
      name: request.name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: request.parentFolderId ? [request.parentFolderId] : undefined,
    };

    const response = await this.request<DriveFile>('/files', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(metadata),
    });

    return {
      id: response.id,
      name: response.name,
      createdTime: response.createdTime,
      modifiedTime: response.modifiedTime,
      webViewLink: response.webViewLink,
    };
  }

  // Create PRD folder structure
  async createPRDFolder(prdId: string, prdTitle: string): Promise<DriveFolder> {
    // Create main PRD folder
    const prdFolder = await this.createFolder({
      name: `PRD-${prdTitle}`,
    });

    // Create subfolders for sections
    const sections = [
      '01-Problem-Statement',
      '02-User-Stories',
      '03-Success-Metrics',
      '04-Technical-Approach',
      '05-Dependencies-Risks',
      '06-Go-to-Market',
      '07-Resources',
      '08-Legal-Compliance',
    ];

    for (const section of sections) {
      await this.createFolder({
        name: section,
        parentFolderId: prdFolder.id,
      });
    }

    return prdFolder;
  }

  // Upload file
  async uploadFile(request: UploadFileRequest): Promise<DriveFile> {
    const metadata = {
      name: request.name,
      mimeType: request.mimeType,
      description: request.description,
      parents: request.folderId ? [request.folderId] : undefined,
    };

    // For simple text content
    if (typeof request.content === 'string') {
      const boundary = '-------314159265358979323846';
      const delimiter = `\r\n--${boundary}\r\n`;
      const closeDelimiter = `\r\n--${boundary}--`;

      const body =
        delimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        `Content-Type: ${request.mimeType}\r\n\r\n` +
        request.content +
        closeDelimiter;

      const response = await fetch(`${this.UPLOAD_BASE}/files?uploadType=multipart`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config?.accessToken}`,
          'Content-Type': `multipart/related; boundary=${boundary}`,
        },
        body,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      return response.json();
    }

    // For Blob content (binary files)
    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    formData.append('file', request.content);

    const response = await fetch(`${this.UPLOAD_BASE}/files?uploadType=multipart`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config?.accessToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Upload PRD document
  async uploadPRDDocument(prdId: string, prdTitle: string, content: string, folderId?: string): Promise<DriveFile> {
    const fileName = `PRD-${prdTitle}-${new Date().toISOString().split('T')[0]}.md`;
    
    return this.uploadFile({
      name: fileName,
      content,
      mimeType: 'text/markdown',
      folderId,
      description: `PRD Document for ${prdTitle}`,
    });
  }

  // Update file
  async updateFile(fileId: string, updates: Partial<DriveFile>): Promise<DriveFile> {
    const response = await this.request<DriveFile>(`/files/${fileId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    return response;
  }

  // Delete file
  async deleteFile(fileId: string): Promise<void> {
    await this.request(`/files/${fileId}`, {
      method: 'DELETE',
    });
  }

  // Share file
  async shareFile(fileId: string, email: string, role: 'reader' | 'commenter' | 'writer' = 'reader'): Promise<void> {
    await this.request(`/files/${fileId}/permissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role,
        type: 'user',
        emailAddress: email,
      }),
    });
  }

  // Get file permissions
  async getFilePermissions(fileId: string) {
    return this.request(`/files/${fileId}/permissions`);
  }

  // Generate export link for Google Workspace files
  async getExportLink(fileId: string, mimeType: string): Promise<string> {
    const exportMimeTypes: Record<string, string> = {
      'application/vnd.google-apps.document': 'application/pdf',
      'application/vnd.google-apps.spreadsheet': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.google-apps.presentation': 'application/pdf',
    };

    const exportMimeType = exportMimeTypes[mimeType];
    if (!exportMimeType) {
      throw new Error('File type not exportable');
    }

    return `${this.API_BASE}/files/${fileId}/export?mimeType=${encodeURIComponent(exportMimeType)}`;
  }

  // Get file preview
  async getFilePreview(fileId: string): Promise<string | null> {
    try {
      const file = await this.getFile(fileId);
      return file.thumbnailLink || null;
    } catch {
      return null;
    }
  }
}

export const googleDriveClient = new GoogleDriveClient();
export default GoogleDriveClient;
