import { FiFile } from "react-icons/fi";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { customModalStyles } from "../constants/modalStyles";
import {
  deleteFile,
  getFiles,
  saveFileContent,
  getFileContent,
} from "../utils/octokit";
import { octokit } from "@/credientials/credentials";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<any[]>([]);
  const [fileContent, setFileContent] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState<any>(false);
  const [editModalFilePath, setEditModalFilePath] = useState("");

  useEffect(() => {
    getFiles().then((data: any) => {
      setFiles(data);
    });
  }, []);

  async function getFileContent(filePath: string) {
    const response = await octokit.repos.getContent({
      owner: process.env.REPO_OWNER,
      repo: process.env.REPO_NAME,
      path: filePath,
    });

    const fileContent = Buffer.from(response.data.content, "base64").toString();
    setFileContent(fileContent);
    setEditModalFilePath(filePath);
    setIsEditModalOpen(true);
  }

  return (
    <>
      <main className="mx-4 xl:mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold underline my-8">
          Files in Repository
        </h1>

        <ul>
          {files
            .filter((file) => file.type !== "dir")
            .map((file) => (
              <li key={file.name} className="flex items-center my-2">
                <FiFile className="text-2xl text-gray-600 mr-2" />
                <a href={file.html_url} className="text-xl text-black">
                  {file.name}
                </a>
                <div className="flex my-4 md:my-0 justify-end">
                  <button
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300
                   font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    onClick={() => getFileContent(file.path)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300
                   font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none dark:focus:ring-red-800"
                    onClick={() => deleteFile(file.path)}
                  >
                    Delete
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
        <button
          onClick={() =>
           setIsEditModalOpen(false)
          }
        >
          Cancel
        </button>
      </Modal>
    </>
  );
}
