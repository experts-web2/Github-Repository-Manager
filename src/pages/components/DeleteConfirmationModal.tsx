import { DeleteConfirmationModalProps } from "@/types/types";
import React from "react";

function DeleteConfirmationModal({
  deleteFilePath,
  onCancelDelete,
  onDeleteFile,
}: DeleteConfirmationModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      <div className="absolute inset-0 bg-gray-900 opacity-50"></div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md z-10">
        <p className="text-gray-900 dark:text-white mb-2">
          Are you sure you want to delete the {deleteFilePath} file?
          <br />
          It will take 1 minute to remove from the list.
        </p>
        <div className="flex justify-end">
          <button
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mr-2"
            onClick={onCancelDelete}
          >
            Cancel
          </button>
          <button
            className="text-white bg-red-700 hover:bg-red-800 font-medium rounded text-sm px-5 py-2 dark:bg-red-600 dark:hover:bg-red-700"
            onClick={onDeleteFile}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;
