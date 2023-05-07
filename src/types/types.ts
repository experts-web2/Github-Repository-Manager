export type File = {
    name: string;
    path: string;
    sha: string;
    size: number;
    url: string;
    html_url: string;
    git_url: string;
    download_url: string;
    type: string;
    _links: {
      self: string;
      git: string;
      html: string;
    };
  };


  export interface DeleteConfirmationModalProps {
    deleteFilePath: string;
    onCancelDelete: () => void;
    onDeleteFile: () => void;
  }
  

  export interface EditModelProps {
    isEditModalOpen: boolean;
    setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    fileContent: string;
    setFileContent: React.Dispatch<React.SetStateAction<string>>;
    editModalFilePath: string;
    setEditModalFilePath: React.Dispatch<React.SetStateAction<string>>;
    saveFileContent: any;
  }