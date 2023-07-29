import React, { useState } from 'react';

const ComprehensionQuestion = ({onDelete,questionIndex, updateQuestionData}) => {
  // State to store question details
  const [instructions, setInstructions] = useState('');
  const [passage, setPassage] = useState('');
  const [media, setMedia] = useState(null);
  const [questions, setQuestions] = useState([
    {
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 1,
    },
  ]);

  // Function to handle media upload
  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    setMedia(file);
  };

  // Function to handle input changes for questions
  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  // Function to add more questions
  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        points: 1,
      },
    ]);
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);
  };

  // console.log({instructions,passage,"subquestions":questions});

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
      {/* Instructions */}
      <div className="mb-2">
        <label htmlFor="instructions" className="text-lg font-semibold">
          Instructions:
        </label>
        <textarea
          id="instructions"
          className="p-2 rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-300 w-full h-24"
          placeholder="Enter Instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
      </div>

      {/* Passage */}
      <div className="mb-2">
        <label htmlFor="passage" className="text-lg font-semibold">
          Passage:
        </label>
        <textarea
          id="passage"
          className="p-2 rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-300 w-full h-32"
          placeholder="Enter Passage"
          value={passage}
          onChange={(e) => setPassage(e.target.value)}
        />
      </div>

      {/* Media Upload */}
      <div className="mb-4">
        <label htmlFor="media" className="text-lg font-semibold">
          Upload Media (if any):
        </label>
        <input
          id="media"
          type="file"
          accept="image/*,video/*"
          onChange={handleMediaUpload}
          className="mt-2"
        />
      </div>

      {/* Questions */}
      <div>
        <label className="text-lg font-semibold">Questions:</label>
        {questions.map((question, index) => (
          <div key={index} className="mt-4">
            <label htmlFor={`question-${index}`} className="text-base font-medium">
              Question {index + 1}:
            </label>
            <input
              id={`question-${index}`}
              type="text"
              className="p-2 rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-300 w-full mt-2"
              placeholder="Enter Question"
              value={question.question}
              onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
            />

            {/* Options */}
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="mt-2 flex">
                <input
                  type="text"
                  className="p-2 rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-300 flex-1 mr-2"
                  placeholder={`Option ${optionIndex + 1}`}
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...questions[index].options];
                    newOptions[optionIndex] = e.target.value;
                    handleQuestionChange(index, 'options', newOptions);
                  }}
                />
                <label>
                  <input
                    type="radio"
                    value={optionIndex + 1}
                    checked={parseInt(question.correctAnswer) === optionIndex + 1}
                    onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
                  />
                  Correct
                </label>
              </div>
            ))}

            {/* Points */}
            <div className="mt-2">
              <label htmlFor={`points-${index}`} className="text-base font-medium">
                Points:
              </label>
              <input
                id={`points-${index}`}
                type="number"
                className="p-2 rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-300 w-20 mt-2"
                value={question.points}
                onChange={(e) => handleQuestionChange(index, 'points', e.target.value)}
              />
            </div>
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded focus:outline-none mt-2"
              onClick={() => handleDeleteQuestion(index)}
            >
              Delete Question
            </button>
          </div>
        ))}
      </div>

      {/* Add More Question */}
      <div className="flex space-x-2 justify-center">
      <button
        className="bg-green-500  text-white px-4 py-2 rounded focus:outline-none mt-4"
        onClick={handleAddQuestion}
      >
        Add More Question
      </button>
      <button
        className="bg-green-500  text-white px-4 py-2 rounded focus:outline-none mt-4"
        onClick={()=>updateQuestionData(questionIndex,{instructions,passage,"subquestions":questions})}
      >
        Save Question
      </button>
      </div>
    </div>
  );
};

export default ComprehensionQuestion;
