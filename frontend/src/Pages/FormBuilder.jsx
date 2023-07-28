import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CategorizeQuestion from '../Components/CategorizeQuestion';
import ClozeQuestion from '../Components/ClozeQuestion';
import ComprehensionQuestion from '../Components/ComprehensionQuestion';

const FormBuilder = () => {
  // State to store the header image and form title
  const [headerImage, setHeaderImage] = useState(null);
  const [formTitle, setFormTitle] = useState('');

  // State to store the form questions
  const [questions, setQuestions] = useState([]);

  // Function to handle the header image upload
  const handleHeaderImageUpload = (e) => {
    const file = e.target.files[0];
    setHeaderImage(file);
  };

  // Function to handle editing the form title and image
  const handleEdit = () => {
    setHeaderImage(null);
    setFormTitle('');
  };

  // Function to add a new question to the form
  const handleAddQuestion = (questionType) => {
    let newQuestion;
    switch (questionType) {
      case 'Categorize':
        newQuestion = { type:'Categorize' };
        break;
      case 'Cloze':
        newQuestion = { type: 'Cloze' };
        break;
      case 'Comprehension':
        newQuestion = { type: 'Comprehension'};
        break;
      default:
        newQuestion = { type: 'Unknown' };
        break;
    }

    setQuestions([...questions, newQuestion]);
  };

  // Function to delete a question from the form
  const handleDeleteQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  const handleQuestionData = (index, data) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], data };
    setQuestions(updatedQuestions);
    // console.log(questions)
  };

  const updateQuestionData=(index, data)=>{
    handleQuestionData(index,data)
  }

  // console.log(questions);

  return (
    <div className="max-w-3xl mx-auto mt-6 p-4">
      {/* Form Title and Edit Button */}
      <div className="flex items-center mb-4">
        <input type="file" accept="image/*" onChange={handleHeaderImageUpload} />
        <input
          type="text"
          className="flex-1 p-2 rounded border border-gray-300 mr-2 focus:outline-none focus:ring focus:border-blue-300"
          placeholder="Enter Form Title"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded focus:outline-none"
          onClick={handleEdit}
        >
          Edit
        </button>
      </div>

      {/* Header Image */}
      <div className="flex items-center mb-4">
        <div className="rounded-full overflow-hidden w-12 h-12 mr-4">
          {headerImage ? (
            <img
              src={URL.createObjectURL(headerImage)}
              alt="Header"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-600 text-sm text-center">No Image</span>
            </div>
          )}
        </div>
        <span className="text-xl font-bold">{formTitle}</span>
      </div>

      {/* Add Question Buttons */}
      <div className="mb-4">
        <label className="text-lg font-semibold">Add Question:</label>
        <div className="flex space-x-2">
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded focus:outline-none"
            onClick={() => handleAddQuestion('Categorize')}
          >
            Categorize
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded focus:outline-none"
            onClick={() => handleAddQuestion('Cloze')}
          >
            Cloze
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded focus:outline-none"
            onClick={() => handleAddQuestion('Comprehension')}
          >
            Comprehension
          </button>
        </div>
      </div>

      {/* Display Added Questions */}
      {questions.map((question, index) => (
        <div key={index} className="mb-4">
          {question.type === 'Categorize' && (
            <CategorizeQuestion updateQuestionData={updateQuestionData}  questionIndex={index} onDelete={() => handleDeleteQuestion(index)} />
          )}
          {question.type === 'Cloze' && (
            <ClozeQuestion updateQuestionData={updateQuestionData}  questionIndex={index} onDelete={() => handleDeleteQuestion(index)} />
          )}
          {question.type === 'Comprehension' && (
            <ComprehensionQuestion updateQuestionData={updateQuestionData}  questionIndex={index} onDelete={() => handleDeleteQuestion(index)} />
          )}
        </div>
      ))}

      {/* Preview/Fill Link */}
      <div className="mt-4">
        <Link
          to="/preview-fill"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded focus:outline-none"
        >
          Preview/Fill
        </Link>
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded focus:outline-none mt-4"
        onClick={()=>console.log({formTitle,questions})}
      >
        Save Question
      </button>
    </div>
  );
};

export default FormBuilder;
