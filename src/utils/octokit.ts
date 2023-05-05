import { octokit} from "../credientials/credentials";
const owner = process.env.REPO_OWNER;
const file=process.env.REPO_NAME

console.log(owner,file)

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





export async function getFiles(path: string = ""): Promise<File[]> {
  try {
    const { data } = await octokit.repos.getContent({
      owner: owner,
      repo: file,
      path: path,
    });

    const files = data as File[];

    const subDirs = files.filter((file) => file.type === "dir");
    const subFiles = files.filter((file) => file.type === "file");
    let allFiles = [...subFiles];

    for (const subDir of subDirs) {
      const dirFiles = await getFiles(subDir.path);
      allFiles = [...allFiles, ...dirFiles];
    }

    return allFiles;
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
    repo: file,
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
  fileContent: string,
  setIsEditModalOpen:any,
  setFileContent: React.Dispatch<React.SetStateAction<string>>,
  setEditModalFilePath: React.Dispatch<React.SetStateAction<string>>,
): Promise<void> {
  const response = await octokit.repos.createOrUpdateFileContents({
    owner: owner,
    repo: file,
    path: editModalFilePath,
    message: "Update file content",
    content: Buffer.from(fileContent).toString("base64"),
    sha: await getFileSha(editModalFilePath),
  });

  setFileContent("");
  setEditModalFilePath("");
  setIsEditModalOpen(false);
  getFiles();
}

export async function getFileSha(filePath: string): Promise<string> {
  try {
    const response = await octokit.repos.getContent({
      owner: owner,
      repo: file,
      path: filePath,
    });
    return response.data.sha;
  } catch (error) {
    console.error(error);
    return "";
  }
}

export async function deleteFile(filePath: string): Promise<void> {
  try {
    const sha = await getFileSha(filePath);
    const response = await octokit.repos.deleteFile({
      owner: owner,
      repo: file,
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



  