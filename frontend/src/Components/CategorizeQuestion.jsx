import React, { useState } from 'react';

const CategorizeQuestion = ({ onDelete, questionIndex, updateQuestionData }) => {

  const [questionTitle, setQuestionTitle] = useState('');
  const [headerImage, setHeaderImage] = useState(null);
  const [categories, setCategories] = useState(['', '']);
  const [names, setNames] = useState([{ name: '', category: '' }]);

  // Function to handle header image upload
  const handleHeaderImageUpload = (e) => {
    const file = e.target.files[0];
    setHeaderImage(file);
  };

  // Function to handle input changes for categories
  const handleCategoryChange = (index, value) => {
    const newCategories = [...categories];
    newCategories[index] = value;
    setCategories(newCategories);
  };

  // Function to handle input changes for names
  const handleNameChange = (index, field, value) => {
    const newNames = [...names];
    newNames[index][field] = value;
    setNames(newNames);
  };

  // Function to add more options for names and categories
  const handleAddOption = () => {
    setNames([...names, { name: '', category: '' }]);
  };

  // Function to handle deleting an option
  const handleDeleteOption = (index) => {
    const updatedNames = [...names];
    updatedNames.splice(index, 1);
    setNames(updatedNames);
  };



  return (
    <div className="my-6">
      <div className='flex justify-around items-center border p-1 bg-slate-100'>
        <h2 className="text-lg font-semibold">Question {questionIndex+1}</h2>
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded focus:outline-none"
          onClick={onDelete}
        >
          Delete Question
        </button>
      </div>
      {/* Question Title */}
      <div className="mb-2">
        <label htmlFor="questionTitle" className="text-lg font-semibold">
          Question:
        </label>
        <input
          id="questionTitle"
          type="text"
          className="p-2 rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-300 w-full"
          placeholder="Enter Question Title"
          value={questionTitle}
          onChange={(e) => setQuestionTitle(e.target.value)}
        />
      </div>

      {/* Header Image */}
      <div className="mb-4">
        <label htmlFor="headerImage" className="text-lg font-semibold">
          Upload Question Image (if any):
        </label>
        <input
          id="headerImage"
          type="file"
          accept="image/*"
          onChange={handleHeaderImageUpload}
          className="mt-2"
        />
      </div>

      {/* Categories */}
      <div className="mb-4">
        <label className="text-lg font-semibold">Categories:</label>
        {categories.map((category, index) => (
          <input
            key={index}
            type="text"
            className="p-2 rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-300 w-full mt-2"
            placeholder={`Enter Category ${index + 1}`}
            value={category}
            onChange={(e) => handleCategoryChange(index, e.target.value)}
          />
        ))}
      </div>

      {/* Names and Categories */}
      <div>
        <label className="text-lg font-semibold">Names and Categories:</label>
        {names.map((name, index) => (
          <div key={index} className="flex mt-2">
            <input
              type="text"
              className="p-2 rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-300 flex-1 mr-2"
              placeholder="Enter Name"
              value={name.name}
              onChange={(e) => handleNameChange(index, 'name', e.target.value)}
            />
            <input
              type="text"
              className="p-2 rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-300 flex-1 mr-2"
              placeholder="Enter Category"
              value={name.category}
              onChange={(e) =>
                handleNameChange(index, 'category', e.target.value)
              }
            />
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded focus:outline-none"
              onClick={() => handleDeleteOption(index)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Add More Option */}
      <div className="flex space-x-2 justify-center">
      <button
        className="bg-green-500  text-white px-4 py-2 rounded focus:outline-none mt-4"
        onClick={handleAddOption}
      >
        Add More Option
      </button>
      <button
        className="bg-green-500  text-white px-4 py-2 rounded focus:outline-none mt-4"
        onClick={()=>{
          updateQuestionData(questionIndex,{questionTitle,categories,names})
          alert("Question Saved!")
        }}
      >
        Save Question
      </button>
      </div>
    </div>
  );
};

export default CategorizeQuestion;
