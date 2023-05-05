import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { customModalStyles } from "../constants/modalStyles";
import {
  deleteFile,
  getFileContent,
  getFiles,
  saveFileContent,
  getRepositories,
} from "../utils/octokit";
import { octokit } from "@/credientials/credentials";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [files, setFiles] = useState<any[]>([]);
  const [fileContent, setFileContent] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState<any>(false);
  const [editModalFilePath, setEditModalFilePath] = useState("");
  const [repositories, setRepositories] = useState<any[]>([]);
  const [selectedRepository, setSelectedRepository] = useState<any>(null);
  const [selectedRepo, setSelectedRepo] = useState<any>("");


  useEffect(() => {
      getFiles().then((data) => {
        console.log(data);
        setFiles(data);
      });
   
  },[]);

  async function getFileContent(
    filePath: string,
    setFileContent: React.Dispatch<React.SetStateAction<string>>,
    setEditModalFilePath: React.Dispatch<React.SetStateAction<string>>,
    setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  ): Promise<any> {
    const response = await octokit.repos.getContent({
      owner: "waqas831",
      repo: selectedRepo,
      path: filePath,
    });
    console.log(response);

    const fileContent = Buffer.from(
      response?.data?.content,
      "base64"
    ).toString();
    setFileContent(fileContent);
    setEditModalFilePath(filePath);
    setIsEditModalOpen(true);
  }

  return (
    <>
      <main className="mx-4 xl:mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold underline my-8">
          Files in Repository {selectedRepo}
        </h1>
     
        <ul className="border border-gray-300 p-4 rounded shadow-lg">
          {files.map((file: any) => (
            <li
              key={file.name}
              className="block md:flex justify-between items-center my-2"
            >
              <a href={file.html_url} className="text-xl" >
                {file.name}
              </a>
              <div className="flex my-4 md-my-0 justify-end">
                <button
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300
                   font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  onClick={() => deleteFile(file.path, selectedRepo)}
                >
                  Delete
                </button>
                <button
                 className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300
                 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                  onClick={() =>
                    getFileContent(
                      file.path,
                      setFileContent,
                      setEditModalFilePath,
                      setIsEditModalOpen
                    )
                  }
                >
                  Edit
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>

      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        style={customModalStyles}
      >
        <h2>Edit File</h2>
        <textarea
          cols={40}
          rows={40}
          style={{
            width: "500px",
            height: "500px",
          }}
          value={fileContent}
          onChange={(e) => setFileContent(e.target.value)}
        />
        <button
          onClick={() =>
            saveFileContent(
              selectedRepository,
              editModalFilePath,
              fileContent,
              setFileContent,
              setEditModalFilePath,
              setIsEditModalOpen
            )
          }
        >
          Save
        </button>
      </Modal>
    </>
  );
}
