import { customModalStyles } from "@/constants/modalStyles";
import { EditModelProps } from "@/types/types";
import React from "react";
import Modal from "react-modal";

const EditModel = ({
  isEditModalOpen,
  setIsEditModalOpen,
  fileContent,
  setFileContent,
  editModalFilePath,
  saveFileContent,
}: EditModelProps) => {
  async function handleSave() {
    const res = await saveFileContent(editModalFilePath, fileContent);
    if (res) {
      setIsEditModalOpen(false);
      setFileContent("");
      
    }
  }

  return (
    <>
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
          className="block max-w-xs md:max-w-lg p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={fileContent}
          onChange={(e) => setFileContent(e.target.value)}
        />
        <div className="mt-4 flex items-center justify-end">
          <button
            onClick={handleSave}
            className="bg-blue-500 font-semibold font-medium text-white px-2 mr-2 py-1 border border-blue-500 rounded"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditModalOpen(false)}
            className="bg-blue-500 font-semibold font-medium text-white px-2 py-1 border border-blue-500 rounded"
          >
            Cancel
          </button>
        </div>
      </Modal>
    </>
  );
};

export default EditModel;
