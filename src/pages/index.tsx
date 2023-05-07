import { FiFile } from "react-icons/fi";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { customModalStyles } from "@/constants/modalStyles";
import { deleteFile, getFiles, saveFileContent } from "@/utils/octokit";
import { octokit } from "@/credientials/credentials";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [files, setFiles] = useState<any[]>([]);
  const [fileContent, setFileContent] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState<any>(false);
  const [editModalFilePath, setEditModalFilePath] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteFilePath, setDeleteFilePath] = useState("")

  const handleConfirmDelete = (filePath: string) => {
    setDeleteFilePath(filePath)
    setConfirmDelete(true);
  };

  const handleCancelDelete = () => {
    setDeleteFilePath("");
    setConfirmDelete(false);
  };

  useEffect(() => {
    getFiles().then((data: any) => {
      setFiles(data);
    });
   
  }, []);

  const deleteSelectedFile = ()=>{
    deleteFile(deleteFilePath).then((response: any) => {
      if(response){
      setDeleteFilePath("");
      setConfirmDelete(false);
      }
      
    })

  }

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
                  {!confirmDelete && (
                    <button
                      className="text-white bg-red-700 hover:bg-red-800 font-medium rounded text-sm px-5 py-2 dark:bg-red-600 dark:hover:bg-red-700"
                      onClick={() => handleConfirmDelete(file.path)}
                    >
                      Delete
                    </button>
                  )}
                  {confirmDelete && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md z-10">
            <p className="text-gray-900 dark:text-white mb-2">
              Are you sure you want to delete the {deleteFilePath} file?<br/>
              It will take 1 minute to remove from the list.
            </p>
            <div className="flex justify-end">
              <button
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mr-2"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>
              <button
                className="text-white bg-red-700 hover:bg-red-800 font-medium rounded text-sm px-5 py-2 dark:bg-red-600 dark:hover:bg-red-700"
                onClick={deleteSelectedFile}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
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
