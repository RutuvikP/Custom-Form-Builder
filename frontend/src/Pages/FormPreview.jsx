import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';


const FormPreview = () => {
    const { formID } = useParams()
    const [data, setData] = useState({})
    const [timer, setTimer] = useState(false)
    const [answer, setAnswer] = useState([])
    const [category, setCategory] = useState([]);
    const [items, setItems] = useState([]);
    const [droppedCategory, setDroppedCategory] = useState([]);
    const navigate = useNavigate();

    // For storing Email and Password
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");

    useEffect(() => {
        fetch(`https://formbulder-server.onrender.com/forms/${formID}`)
            .then((res) => res.json())
            .then((res) => {
                setData(res)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    // State to store user responses for each question
    let [responses, setResponses] = useState([]);

    useEffect(() => {
        const initialItems = data?.questions?.map((question) => {
            if (question.type === 'Categorize') {
                return {
                    question,
                    items: question.data.names.map((item, index) => ({
                        id: `${item.name}+${index}`,
                        content: item.name,
                        category: null,
                    })),
                };
            } else {
                return null;
            }
        });
        setItems(initialItems?.filter(Boolean) || []);
    }, [data]);

    useEffect(() => {
        const initialCategories = data?.questions?.map((question) => {
            if (question.type === 'Categorize') {
                return question.data.categories;
            } else {
                return null;
            }
        });
        setCategory(initialCategories?.filter(Boolean) || []);
    }, [data]);

    const handleSubmit = () => {
        fetch(`https://formbulder-server.onrender.com/response/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ formID, name, email, "responses": answer })
        })
            .then((res) => res.json())
            .then((res) => {
                navigate('/thankyou')
            })
            .catch((err) => {
                // console.log(err);
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
        if (type == "Categorize") {
            responses = droppedCategory
        }
        if (type == "Cloze") {
            responses = responses[0].split(',')
        }
        let question = `question${i + 1}`
        setAnswer([...answer, { [question]: responses }])
        setResponses([])
        alert("Answer Submitted!")
    }

    // For Cloze type of Question
    const countdownTimer = () => {
        let count = 0;
        const ID = setInterval(() => {
            if (count == 5) {
                setTimer(true)
                clearInterval(ID)
            } else {
                count++
            }
        }, 1000);
    }

    const handleDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        const sourceIndex = result.source.index;
        const sourceQuestionIndex = parseInt(result.source.droppableId.split('-')[1]);
        const destinationCategory = result.destination.droppableId.split('-')[1];

        if (
            Number.isNaN(sourceQuestionIndex) ||
            !items[sourceQuestionIndex]?.items ||
            !destinationCategory
        ) {
            return;
        }

        const updatedItems = [...items];
        const draggedItem = updatedItems[sourceQuestionIndex].items[sourceIndex];

        // Find the correct categories for the specific question
        const questionCategories = category[sourceQuestionIndex];
        if (!questionCategories) {
            return;
        }

        // Find the category index within the specific question's categories
        const categoryIndex = questionCategories.indexOf(destinationCategory);
        if (categoryIndex === undefined || categoryIndex === -1) {
            return;
        }

        // Set the category of the dragged item
        draggedItem.category = questionCategories[categoryIndex];

        // Update the 'droppedCategory' state to store the dropped item
        setDroppedCategory((prevDropCategory) => [...prevDropCategory, draggedItem]);

        // Remove the dragged item from the 'items' state
        updatedItems[sourceQuestionIndex].items.splice(sourceIndex, 1);
        setItems(updatedItems);
    };

    return (
        <DragDropContext
            onDragEnd={handleDragEnd}
        >
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
                                        onChange={(e) => setName(e.target.value)}
                                        className="p-2 rounded border border-gray-300 focus:outline-none focus:ring focus:border-blue-300 flex-1 mr-2"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="text-lg font-semibold mr-4">Email:</label>
                                    <input
                                        type="email"
                                        placeholder='Enter your Email'
                                        onChange={(e) => setEmail(e.target.value)}
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
                                            <h4 className='font-semibold mt-2'>Options you have: </h4>
                                            <Droppable droppableId={`${question.data.questionTitle}-${index}`} direction='horizontal'>
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.droppableProps}>
                                                        {items[index]?.items.map((el, i) => (
                                                            <Draggable key={el.id} draggableId={el.id} index={i}>
                                                                {(provided) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        className='flex'
                                                                    >
                                                                        <p className='text-md mt-2 font-bold border-2 px-4 pb-1 rounded-full bg-blue-400' key={el + i}>{el.content}</p>
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                    </div>
                                                )}
                                            </Droppable>
                                            <div className='mt-5'>
                                                <h3 className=' text-md font-semibold mt-2 mb-2' >Submit Your Answers Below:</h3>
                                                {category ? (
                                                    <div className='flex p-5'>
                                                        {category[index]?.map((category, i) => (
                                                            <div key={i} className='h-[200px] border-2 border-blue-500 rounded-md ml-5 w-[150px] p-2 text-center mb-2'>
                                                                <div className='border-b-2 p-1.5 mb-2 font-bold'>{category}</div>
                                                                <Droppable droppableId={`category-${category}`} direction='vertical'>
                                                                    {(provided) => (
                                                                        <div {...provided.droppableProps} ref={provided.innerRef}>
                                                                            {droppedCategory?.map((item, itemIndex) => {
                                                                                if (item.category === category) {
                                                                                    return (
                                                                                        <Draggable key={item.id} draggableId={item.id} index={itemIndex}>
                                                                                            {(provided) => (
                                                                                                <div
                                                                                                    ref={provided.innerRef}
                                                                                                    {...provided.draggableProps}
                                                                                                    {...provided.dragHandleProps}
                                                                                                    className='p-1
                                                                                                    rounded-full
                                                                                                    mt-1
                                                                                                    font-bold
                                                                                                    bg-blue-400'
                                                                                                >
                                                                                                    {item.content}
                                                                                                </div>
                                                                                            )}
                                                                                        </Draggable>
                                                                                    );
                                                                                } else {
                                                                                    return null;
                                                                                }
                                                                            })}
                                                                            {provided.placeholder}
                                                                        </div>
                                                                    )}
                                                                </Droppable>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div>Loading...</div>
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
                                                        }, 4000)
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
                                                {!timer ? "Please wait.." : "Submit Answer"}
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
        </DragDropContext>

    );
};

export default FormPreview;