// Google Drive Integration Types

export interface GoogleDriveConfig {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  userEmail: string;
  userName: string;
  isConnected: boolean;
  connectedAt?: string;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  description?: string;
  size?: number;
  createdTime: string;
  modifiedTime: string;
  webViewLink: string;
  webContentLink?: string;
  thumbnailLink?: string;
  parents: string[];
  owners: Array<{
    displayName: string;
    emailAddress: string;
  }>;
  permissions?: Array<{
    id: string;
    type: 'user' | 'group' | 'domain' | 'anyone';
    role: 'owner' | 'organizer' | 'fileOrganizer' | 'writer' | 'commenter' | 'reader';
    emailAddress?: string;
  }>;
}

export interface DriveFolder {
  id: string;
  name: string;
  createdTime: string;
  modifiedTime: string;
  webViewLink: string;
}

export interface PRDDriveLink {
  prdId: string;
  prdSectionId?: string;
  fileId: string;
  fileName: string;
  fileType: string;
  webViewLink: string;
  attachedAt: string;
  attachedBy: string;
  syncEnabled: boolean;
}

export interface UploadFileRequest {
  name: string;
  content: string | Blob;
  mimeType: string;
  folderId?: string;
  description?: string;
}

export interface CreateFolderRequest {
  name: string;
  parentFolderId?: string;
}

export interface FilePermission {
  id: string;
  type: 'user' | 'group' | 'domain' | 'anyone';
  role: 'owner' | 'organizer' | 'fileOrganizer' | 'writer' | 'commenter' | 'reader';
  emailAddress?: string;
  displayName?: string;
}

export interface DriveSearchResult {
  files: DriveFile[];
  nextPageToken?: string;
}

export interface DriveQuota {
  limit: number;
  usage: number;
  usageInDrive: number;
  usageInDriveTrash: number;
}
