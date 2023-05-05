import { octokit} from "../credientials/credentials";
const owner = "waqas831";

type File = {
  name: string;
  path: string;
  type: string;
  download_url: string;
};

type CustomModalStyles = {
  content: {
    top: string;
    left: string;
    right: string;
    bottom: string;
    marginRight: string;
    transform: string;
  };
};



export const customModalStyles: CustomModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

export async function getFiles(): Promise<File[]> {
  try {
    const { data } = await octokit.repos.getContent({
      owner: owner,
      repo: "files",
    });
    const files = data.filter((file: File) => file.type === "file");
    console.log(files);
    return files;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getFileContent(
  filePath: string,
  selectedRepo:any,
  setFileContent: React.Dispatch<React.SetStateAction<string>>,
  setEditModalFilePath: React.Dispatch<React.SetStateAction<string>>,
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>
): Promise<any> {
    console.log(filePath,selectedRepo);
  const response = await octokit.repos.getContent({
    owner: owner,
    repo: "files",
    path: filePath,
  });
  console.log(response);

  const fileContent = Buffer.from(response?.data?.content, "base64").toString();
  setFileContent(fileContent);
  setEditModalFilePath(filePath);
  setIsEditModalOpen(true);
}

export async function saveFileContent(
  editModalFilePath: string,
  selectedRepo:any,
  fileContent: string,
  setIsEditModalOpen:any,
  setFileContent: React.Dispatch<React.SetStateAction<string>>,
  setEditModalFilePath: React.Dispatch<React.SetStateAction<string>>,
): Promise<void> {
  const response = await octokit.repos.createOrUpdateFileContents({
    owner: owner,
    repo: "files",
    path: editModalFilePath,
    message: "Update file content",
    content: Buffer.from(fileContent).toString("base64"),
    sha: await getFileSha(editModalFilePath,selectedRepo),
  });

  setFileContent("");
  setEditModalFilePath("");
  setIsEditModalOpen(false);
//   getFiles();
}

export async function getFileSha(filePath: string,selectedRepo:any): Promise<string> {
  try {
    const response = await octokit.repos.getContent({
      owner: owner,
      repo: "files",
      path: filePath,
    });
    return response.data.sha;
  } catch (error) {
    console.error(error);
    return "";
  }
}

export async function deleteFile(filePath: string,selectedRepo:any): Promise<void> {
  try {
    const sha = await getFileSha(filePath,selectedRepo);
    const response = await octokit.repos.deleteFile({
      owner: owner,
      repo: "files",
      path: filePath,
      message: "Delete file",
      sha: sha,
    });
    getFiles();
    console.log(response.status);
  } catch (error) {
    console.error(error);
  }
}


export async function getRepositories() {
    try {
      const { data } = await octokit.repos.listForAuthenticatedUser({
        per_page: 100,
      });
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  