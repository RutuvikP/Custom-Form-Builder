import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const FormPreview = () => {
    const { formID } = useParams()
    const [data, setData] = useState({})
    const [timer, setTimer] = useState(false)
    const [answer, setAnswer] = useState([])

    // For storing Email and Password
    const [email,setEmail] = useState("");
    const [name,setName] = useState("");

    useEffect(() => {
        fetch(`http://localhost:8080/forms/${formID}`)
            .then((res) => res.json())
            .then((res) => {
                console.log(res);
                setData(res)
            })
    }, [])

    // State to store user responses for each question
    let [responses, setResponses] = useState([]);

    const handleSubmit = () => {
        fetch(`http://localhost:8080/response/add`,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({formID,name,email,"responses":answer})
        })
        .then((res)=>res.json())
        .then((res)=>{
            alert("Response Saved!!")
        })
        .catch((err)=>{
            console.log(err);
        })
    };

    const formatSentence = (sentence) => {
        const words = sentence.split(' ');
        const formattedWords = words.map((word) =>
            word.startsWith('[') && word.endsWith(']')
                ? '____'
                : word.replace(/\[|\]/g, '')
        );
        return formattedWords.join(' ');
    };

    // For Submitting Answer of Each Question
    const handleAnswerSubmit = (i, type) => {
        if (type == "Cloze") {
            responses = responses[0].split(',')
        }
        let question = `question${i + 1}`
        setAnswer([...answer, { [question]: responses }])
        setResponses([])
    }

    const countdownTimer = () => {
        let count = 0;
        const ID = setInterval(() => {
            if (count == 3) {
                setTimer(true)
                clearInterval(ID)
            } else {
                count++
            }
        }, 1000);
    }

    return (
        <div className='w-[800px] m-auto mb-20'>


            {Object.keys(data).length !== 0 ?
                (
                    <div>
                        <div className='border-2 border-slate-300 p-2 mt-1 mb-5 rounded-md'>
                            <h1 className='text-2xl text-center font-semibold mb-4'>{data.formTitle}</h1>
                        </div>
                        <div className='border-2 border-slate-300 p-5 mb-4 rounded-md'>
                            <h1 className='text-2xl font-semibold mb-6 text-center underline'>Enter Your Details Below</h1>
                            <div className='mb-5'>

                                <label htmlFor="name" className="text-lg font-semibold mr-4">Name:</label>
                                <input
                                    type="text"
                                    required={true}
                                    placeholder='Enter your Full Name'
                                    onChange={(e)=>setName(e.target.value)}
                                    className="p-2 rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-300 flex-1 mr-2"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="text-lg font-semibold mr-4">Email:</label>
                                <input
                                    type="email"
                                    placeholder='Enter your Email'
                                    onChange={(e)=>setEmail(e.target.value)}
                                    required={true}
                                    className="p-2 rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-300 flex-1 mr-2"
                                />
                            </div>
                        </div>

                        {/* Questions */}
                        {data?.questions.map((question, index) => (
                            <div key={index + question} className='border-2 border-slate-300 p-4 rounded-md mb-4'>
                                <h2 className="text-2xl font-bold border-b-2 pb-2 border-blue-500">Question {index + 1}</h2>
                                {/* Display question based on its type */}
                                {question.type === 'Categorize' && (
                                    <div>

                                        <h1 className='text-lg font-bold mt-4 mb-4'>{question.data.questionTitle}</h1>
                                        <h4 className='font-semibold mt-2'>Categories we have: </h4>
                                        {question.data.categories.map((cat, i) => (
                                            <p className='font-bold ' key={cat + i}>{i + 1} - {cat}</p>
                                        ))}
                                        <div className='mt-5'>
                                            <h3 className=' text-md font-semibold mt-2 mb-2' >Select Your Answers for Below Names:</h3>
                                            {question.data.names.map((el, i) =>
                                            (
                                                <div key={el + i} className='flex gap-10'>
                                                    <p className='font-bold' > {el.name}</p>
                                                    <select className='border-2 border-blue-500 mb-2 rounded-md ' onChange={(e) => setResponses([...responses, e.target.value])}>
                                                        <option value="">Select your Answer</option>
                                                        {question.data.categories.map((cat) => (
                                                            <option key={cat} value={cat}>{cat}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )
                                            )}
                                        </div>
                                        <button
                                            className="bg-blue-500  text-white px-4 py-2 rounded focus:outline-none mt-4"
                                            onClick={() => handleAnswerSubmit(index, question.type)}
                                        >
                                            Submit Answer
                                        </button>
                                    </div>

                                )}

                                {question.type === 'Cloze' && (
                                    <div>
                                        <h1 className='text-xl font-bold mt-4 mb-4'> Fill in the blanks.</h1>
                                        <h1 className='text-lg font-bold mt-4 mb-4'>Sentence: {formatSentence(question.data.sentence)}</h1>
                                        <h1 className='text-md font-bold mt-4 mb-2'>Options:</h1>
                                        <div className='flex gap-3'>
                                            {question.data.options.map((el, i) => (
                                                <h1 className='text-md font-bold border-2 px-4 pb-1 rounded-full' key={el + i}>{el}</h1>
                                            ))}
                                        </div>
                                        <div className='flex gap-5 mt-5 '>
                                            <input
                                                onChange={(e) => {
                                                    setTimeout(() => {
                                                        setResponses([...responses, e.target.value])
                                                        countdownTimer()
                                                    }, 3000)
                                                }}
                                        
                                                type='text'
                                                className="p-2 rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-300 flex-1 mr-2"
                                                placeholder={`Enter the Answer`}
                                            />
                                        </div>
                                        <h1 className='italic'>(enter the answers in correct sequence seprated by " , " commas)</h1>
                                        <button
                                            className="bg-blue-500  text-white px-4 py-2 rounded focus:outline-none mt-4"
                                            disabled={!timer ? true : false}
                                            onClick={() => handleAnswerSubmit(index, question.type)}
                                        >
                                            {!timer?"Please wait..":"Submit ANswer"}
                                        </button>
                                    </div>
                                )}

                                {question.type === 'Comprehension' && (
                                    <div>
                                        <h1 className='text-lg font-semibold mt-4 mb-1'>Passage:</h1>
                                        <h1 className='text-md font-semibold rounded-md border p-2 bg-slate-100 mb-4'>{question.data.passage} </h1>
                                        <h1 className='text-md font-bold mt-4 mb-4 italic'>Instructions: {question.data.instructions}</h1>
                                        {question.data.subquestions.map((el, i) => (
                                            <div key={el + i}>

                                                <>
                                                    <h1 className='text-lg font-bold mt-4 mb-2'>{el.question}</h1>
                                                    <p className='font-bold'>Options:</p>
                                                    {el.options.map((item, i) => (
                                                        <div key={item}>
                                                            <input
                                                                type='radio'
                                                                name={i}
                                                                onChange={() => setResponses([...responses, item])}
                                                            />
                                                            <label className='ml-1'>{item}</label>
                                                        </div>
                                                    ))}
                                                </>

                                            </div>
                                        ))}
                                        <button
                                            className="bg-blue-500  text-white px-4 py-2 rounded focus:outline-none mt-4"
                                            onClick={() => handleAnswerSubmit(index, question.type)}
                                        >
                                            Submit Answer
                                        </button>
                                    </div>
                                )}


                            </div>
                        ))}

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            className='bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
                        >
                            Submit
                        </button>

                    </div>) : ""}
        </div>

    );
};

export default FormPreview;