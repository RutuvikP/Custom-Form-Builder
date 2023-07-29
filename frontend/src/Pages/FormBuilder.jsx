import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CategorizeQuestion from '../Components/CategorizeQuestion';
import ClozeQuestion from '../Components/ClozeQuestion';
import ComprehensionQuestion from '../Components/ComprehensionQuestion';

const FormBuilder = () => {
  // State to store the header image and form title
  const [headerImage, setHeaderImage] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formID,setFormID] = useState("")

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

  const handleFormSave=()=>{
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?';
    const charactersLength = characters.length;
    let randomId = '';

    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * charactersLength);
      randomId += characters.charAt(randomIndex);
    }

    setFormID(randomId)

    fetch(`http://localhost:8080/forms/new`,{
      method:"POST",
      headers:{"Content-Type":'application/json'},
      body:JSON.stringify({formTitle,questions,"formID":randomId})
    })
    .then((res)=>res.json())
    .then((res)=>{
      console.log(res);
      alert("Form Saved to DB!!")
    })
    .catch((err)=>{
      console.log(err);
    })
  }

  return (
    <div className="max-w-3xl mx-auto mt-6 p-4 rounded-md border-2 border-slate-300">
      <h1 className='text-2xl font-semibold mb-6 text-center underline'>Questionarie Form Template</h1>
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
      <div className="flex items-center justify-center mb-4">
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
      <div className="mb-4 p-1.5 rounded-md border-2 border-slate-300">
        <label className="text-lg font-semibold block text-center">Add Question:</label>
        <div className="flex space-x-2 justify-center">
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
      <div className="flex space-x-2 justify-center items-center">
      <div className="mt-4 px-4 py-2 rounded">
        <Link
          to={`/preview-fill/${formID}`}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded focus:outline-none"
        >
          Preview Form
        </Link>
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded focus:outline-none mt-4"
        onClick={handleFormSave}
      >
        Save Form
      </button>
      </div>
    </div>
  );
};

export default FormBuilder;
