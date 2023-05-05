import { FiFile } from "react-icons/fi";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { customModalStyles } from "../constants/modalStyles";
import {
  deleteFile,
  getFiles,
  saveFileContent,
} from "../utils/octokit";
import { octokit } from "@/credientials/credentials";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
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
              <li
                key={file.name}
                className="block shadow rounded md:flex justify-between items-center my-4 p-2"
              >
                <div className="flex items-center">
                  <FiFile className="text-2xl text-gray-600 mr-2" />
                  <a href={file.html_url} className="text-xl text-black">
                    {file.name}
                  </a>
                </div>
                <div className="flex mt-4 mb-2 md:my-0 items-center justify-end">
                  <button
                    className="text-white bg-blue-700 hover:bg-blue-800
                   font-medium rounded text-sm px-5 py-2 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 "
                    onClick={() => getFileContent(file.path)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-white bg-red-700 hover:bg-red-800
                   font-medium rounded text-sm px-5 py-2 dark:bg-red-600 dark:hover:bg-red-700 "
                    onClick={() => {deleteFile(file.path)
                    getFiles().then((data: any) => {
                      setFiles(data);
                    });
                    }}
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
        <h2 className="text-3xl mb-3">Edit File</h2>
        <textarea
          cols={40}
          rows={40}
          style={{
            width: "500px",
            height: "200px",
          }}
          className="block max-w-xs  md:max-w-lg p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 
          focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600
           dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={fileContent}
          onChange={(e) => setFileContent(e.target.value)}
        />
        <div className="mt-4 flex items-center justify-end">
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
            className=" bg-blue-500  font-semibold font-medium
          text-white px-2 mr-2 py-1 border border-blue-500  rounded"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditModalOpen(false)}
            className=" bg-blue-500  font-semibold font-medium
           text-white px-2 py-1 border border-blue-500  rounded"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </>
  );
}
