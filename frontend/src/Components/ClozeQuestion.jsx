import React, { useState, useRef } from 'react';

const ClozeQuestion = ({onDelete, questionIndex, updateQuestionData}) => {
  // State to store question details
  const [sentence, setSentence] = useState('');
  const [options, setOptions] = useState([]);

  // Ref to the contenteditable div
  const sentenceRef = useRef(null);

  // Function to handle input change for the sentence
  const handleSentenceChange = () => {
    const updatedSentence = sentenceRef.current.innerText;
    setSentence(updatedSentence);

    // Extract underlined words and set them as options
    const underlinedWords = updatedSentence.match(/\[(.*?)\]/g);
    if (underlinedWords) {
      const newOptions = underlinedWords.map((word) => word.slice(1, -1));
      setOptions(newOptions);
    } else {
      setOptions([]);
    }
  };

  // Function to add more options (wrong answers)
  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  // Function to replace underlined words with underscores
  const formatSentence = () => {
    const words = sentence.split(' ');
    const formattedWords = words.map((word) =>
      word.startsWith('[') && word.endsWith(']')
        ? '____'
        : word.replace(/\[|\]/g, '')
    );
    return formattedWords.join(' ');
  };

  // console.log({sentence,options});

  return (
    <div className="my-6">
      <div className='flex justify-around border p-1 bg-slate-100'>
        <h2 className="text-lg font-semibold">Question {questionIndex+1}</h2>
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded focus:outline-none"
          onClick={onDelete}
        >
          Delete Question
        </button>
      </div>
      {/* Sentence */}
      <div className="mb-4">
        <label htmlFor="sentence" className="text-lg font-semibold">
          Sentence:
        </label>
        <div
          id="sentence"
          ref={sentenceRef}
          contentEditable
          className="p-2 rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-300 w-full"
          placeholder="Type the full sentence or paragraph... use brackets ([]) to create underlined words"
          onInput={handleSentenceChange}
        />
        <p className="text-sm text-gray-500 mt-1">use brackets ([]) to create underlined words</p>
      </div>

      {/* Sentence in Fill in The Blanks Form */}
      <div className="mb-4">
        <label className="text-lg font-semibold">Fill in The Blanks:</label>
        <p className="bg-gray-100 p-2 rounded mt-2">{formatSentence()}</p>
      </div>

      {/* Underlined Words */}
      <div className="mb-4">
        <label className="text-lg font-semibold">Underlined Words:</label>
        {options.map((option, index) => (
          <input
            key={index}
            type="text"
            className="p-2 rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-300 w-full mt-2"
            placeholder="Underlined Word"
            value={option}
            onChange={(e) => {
              const newOptions = [...options];
              newOptions[index] = e.target.value;
              setOptions(newOptions);
            }}
          />
        ))}
      </div>

      {/* Add More Option */}
      <button
        className="bg-green-500  text-white px-4 py-2 rounded focus:outline-none mt-4"
        onClick={handleAddOption}
      >
        Add More Option
      </button>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded focus:outline-none mt-4"
        onClick={()=>updateQuestionData(questionIndex,{sentence,options})}
      >
        Save Question
      </button>
    </div>
  );
};

export default ClozeQuestion;
