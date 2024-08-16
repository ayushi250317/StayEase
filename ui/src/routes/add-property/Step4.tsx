// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import 'react-toastify/dist/ReactToastify.css';
import {useState} from 'react';
import {FiUpload} from 'react-icons/fi';
import {Input} from '@src/src/components/ui/input';
import {Button} from '@src/src/components/ui/button';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Step4 = (data: any) => {
  const {handleFormDataChange, handleSubmit, prevStep} = data;

  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState(false);
  const [files, setFiles] = useState([]);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    const droppedFiles = [...e.dataTransfer.files];
    setFiles([...files, ...droppedFiles]);
  };

  const handleFileChange = (e) => {
    const selectedFiles = [...e.target.files];
    setFiles([...files, ...selectedFiles]);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const submitForm = () => {
    if (files.length < 1) {
      setError(true);
    } else {
      handleFormDataChange({
        photos: files,
      });
      handleSubmit();
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto p-6 bg-white border border-gray-300 rounded-md shadow-md">
        <div
          className={`w-full h-40 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center ${
            dragging ? 'bg-gray-100' : 'bg-white'
          }`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {files.length === 0 ? (
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex items-center justify-center text-gray-500"
            >
              <FiUpload className="text-4xl mr-2" />
              Drag & Drop files here or{' '}
              <span className="underline"> click to select</span>
            </label>
          ) : (
            <ul className="divide-y divide-gray-300">
              {files.map((file, index) => (
                <li
                  key={index}
                  className="py-2 flex items-center justify-between"
                >
                  <span>{file.name}</span>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
          <Input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
            multiple
          />
        </div>
        {error && <p className="text-red-500">Atleast one photo is required</p>}
      </div>
      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Previous
        </button>

        <Button type="submit" onClick={submitForm}>
          Submit
        </Button>
      </div>
    </>
  );
};
