import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Question from "../../models/Question"
import connectToDatabase from "../../middleware/mongoose"
import { GrNext, GrPrevious } from 'react-icons/gr';
import { MdReviews } from 'react-icons/md';
import Link from 'next/link';

const slug = ({ serverQuestion }) => {
    const router = useRouter()
    const [questions, setQuestions] = useState(serverQuestion)
    const [disablednext, setDisablednext] = useState(false)
    const [disabledprevious, setDisabledprevious] = useState(false)
    let userAnswer = null;
    let forReview = false


    const handleChange = (e) => {
        userAnswer = e.target.value
        forUpdateLocalStorage()
    }

    const clearAnswerValue = () => {
        var ele = document.getElementsByName("radios");
        for (var i = 0; i < ele.length; i++) {
            ele[i].checked = false;
        }
        userAnswer = null
        forUpdateLocalStorage()
    }


    const markAnswerValueForReview = () => {
        let reviewMark = document.getElementById('reviewMark')
        let value = reviewMark.classList.toggle('hidden')
        if (value) {
            forReview = false
        }
        else {
            forReview = true
        }
        forUpdateLocalStorage()
    }

    const nextQuestion = () => {
        router.push(`${process.env.NEXT_PUBLIC_HOST}/slug/${router.query.slug}?year=${router.query.year}&language=${router.query.language}&questionNum=${Number.parseInt(router.query.questionNum) + 1}`)
        forUpdateLocalStorage()

    }
    const previousQuestion = () => {
        router.push(`${process.env.NEXT_PUBLIC_HOST}/slug/${router.query.slug}?year=${router.query.year}&language=${router.query.language}&questionNum=${Number.parseInt(router.query.questionNum) - 1}`)
        forUpdateLocalStorage()
    }


    useEffect(() => {
        const infoObj =
        {
            'userAnswer': null,
            'forReview': false,
            'Visited': false
        }
        const questionSlug = localStorage.getItem(questions[router.query.questionNum].slug)
        if (!questionSlug) {
            for (const key of questions) {
                localStorage.setItem(key.slug, JSON.stringify(infoObj))
            }
        }
    }, [])


    useEffect(() => {
        if (Number.parseInt(router.query.questionNum) >= (questions.length - 1)) {
            setDisablednext(true)
        }
        else {
            setDisablednext(false)
        }
        if (Number.parseInt(router.query.questionNum) <= 0) {
            setDisabledprevious(true)
        }
        else {
            setDisabledprevious(false)
        }
    }, [nextQuestion, previousQuestion])

    const forUpdateLocalStorage = () => {
        const slug = questions[router.query.questionNum].slug
        const localStorageAnswer =  JSON.parse(localStorage.getItem(slug));
        
        const infoObj = {
            // {forReview: true, userAnswer: null, Visited: true}
            'forReview': forReview,
            'userAnswer': userAnswer,
            'Visited': true
            // 'forReview': localStorageAnswer.forReview,
            // 'userAnswer': localStorageAnswer.userAnswer,
            // 'Visited': localStorageAnswer.Visited
        }

        localStorage.setItem(slug, JSON.stringify(infoObj))
    }


    useEffect(() => {
        const a = new Date()

        console.log(a.getHours(), a.getMinutes(), a.getSeconds())
        const testTime = localStorage.getItem('time')
        if (!testTime) {
            // setTimeout(() => {

            // },);
            // localStorage.setItem()
        }



        let reviewMark = document.getElementById('reviewMark')
        if (!reviewMark.classList.value.includes('hidden')) {
            forReview = reviewMark.classList.add('hidden')
        }
    }, [router.query])



    return (
        <>
            <div className=''>
                {/* {questions && questions.map((e) => { */}
                {/* {console.log(questions)} */}
                {/* return ( */}
                {questions && <>
                    <div key={questions[router.query.questionNum].slug} className="h-52 flex justify-around font-[ui-monospace] py-60 items-center ">
                        {/* <div className='text-black'></div> */}
                        <div className='text-3xl'>
                            <table onChange={handleChange}>
                                <tbody>
                                    <tr>
                                        <td >
                                            <div className='mb-6'>Q. {questions[router.query.questionNum].question}</div>
                                            <div className='py-3'>
                                                <small>1. </small>
                                                <input className='h-[0.7em] w-[2em]' type="radio" name="radios" value={questions[router.query.questionNum].option_1} />
                                                <small className='ml-3'>{questions[router.query.questionNum].option_1}</small>
                                            </div>
                                            <div className='py-3'>
                                                <small>2. </small>
                                                <input type="radio" className='h-[0.7em] w-[2em]' name="radios" value={questions[router.query.questionNum].option_2} />
                                                <small className='ml-3'>{questions[router.query.questionNum].option_2}</small>
                                            </div>
                                            <div className='py-3'>
                                                <small>3. </small>
                                                <input type="radio" className='h-[0.7em] w-[2em]' name="radios" value={questions[router.query.questionNum].option_3} />
                                                <small className='ml-3'>{questions[router.query.questionNum].option_3}</small>
                                            </div>
                                            <div className='py-3'>
                                                <small>4. </small>
                                                <input type="radio" className='h-[0.7em] w-[2em]' name="radios" value={questions[router.query.questionNum].option_4} />
                                                <small className='ml-3'>{questions[router.query.questionNum].option_4}</small>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className='w-[34rem] text-xl'>
                            <div className='flex justify-between'>
                                <div className='flex items-center justify-between'>
                                    <div className='border-2  p-2 rounded-xl border-black mr-3'>{questions.length - Number.parseInt(router.query.questionNum)}</div>
                                    <span>Not Visited</span>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <div className='border-2  p-2 rounded-xl border-black mr-3'>300</div>
                                    <span>Not Answered</span>
                                </div>
                            </div>
                            <div className='flex justify-between mt-5'>
                                <div className='flex items-center justify-between'>
                                    <div className='border-2  p-2 rounded-xl border-black mr-3'>50</div>
                                    <span>Answered</span>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <div className='border-2  p-2 rounded-xl border-black mr-3'>70</div>
                                    <span>Marked for Review</span>
                                </div>
                            </div>
                            <div className='flex mt-5'>
                                <div className='border-2  p-2 rounded-xl border-black mr-3 '>30</div>
                                <span>Answered & Marked for Review (will be considered for evaluation)</span>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-around font-[ui-monospace]'>
                        <div className='text-xl pb-20 pl-10'>
                            <table>
                                <tbody>
                                    <tr>
                                        <td className='flex justify-between items-center w-[40rem]'>
                                            <div className='py-3'>
                                                <button disabled={disabledprevious} onClick={previousQuestion} className='text-black flex items-center px-3 py-2 rounded-md border border-black disabled:opacity-[0.4] active:bg-slate-700 active:transition-all'><GrPrevious className='mr-2' /> Previous</button>
                                            </div>
                                            <div className='py-3'>
                                                {/* <input type="radio" className='h-[0.9em] w-[2em]' name="radios" value={questions.option_2} /> */}
                                                <button onClick={markAnswerValueForReview} className='text-black flex items-center px-3 py-2 rounded-md border border-black  active:bg-slate-700 active:transition-all'>Mark for Review <MdReviews id='reviewMark' className='ml-4 hidden text-green-900' /></button>
                                            </div>
                                            <div className='py-3'>
                                                <button onClick={clearAnswerValue} className='text-black flex items-center px-3 py-2 rounded-md border border-black active:bg-slate-700 active:transition-all'>Clear</button>
                                            </div>
                                            <div className='py-3'>
                                                <button disabled={disablednext} onClick={nextQuestion} className='text-black border border-black px-3 py-2 rounded-md flex items-center  active:bg-slate-700 active:transition-all disabled:opacity-[0.4]'>Next <GrNext className='ml-2' /></button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className=''>
                            <div className='grid grid-cols-8 grid-rows-8 gap-y-4 gap-x-3'>
                                {questions.map((e, index) => {
                                    return (
                                        <Link href={`${process.env.NEXT_PUBLIC_HOST}/slug/${router.query.slug}?year=${router.query.year}&language=${router.query.language}&questionNum=${index}`}><div key={index} className='hover:from-slate-900 cursor-pointer bg-gradient-to-t border-2 h-10 p-4 rounded-xl border-black flex items-center justify-center'>{index + 1}</div></Link>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </>
                }



            </div>

        </>
    )
}

export default slug;

export async function getServerSideProps(context) {
    connectToDatabase()
    const questions = await Question.find({ "question_subject": context.query.slug, "question_language": context.query.language, "year": Number.parseInt(context.query.year) })
    return {
        props: { serverQuestion: JSON.parse(JSON.stringify(questions)) }
    }
}