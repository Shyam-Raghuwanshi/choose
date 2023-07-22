import Head from 'next/head'
import Image from 'next/image';
import Question from "../models/Question"
import connectToDatabase from "../middleware/mongoose"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import React from 'react'
import { ToastContainer, toast } from 'react-toastify';


const tests = ({ question_lan, question_sub, question_year, all_questions }) => {
    const [allquestions, setAllquestions] = useState(all_questions)
    const [languages, setLanguages] = useState(question_lan)
    const [questions, setQuestions] = useState(question_sub)
    const [years, setYears] = useState(question_year)
    const [testlanguage, setTestlanguage] = useState(null)
    const [testquestion, setTestquestion] = useState(null)
    const [testyear, setTestyear] = useState(null)
    const [disabled, setDisabled] = useState(true)

    const handleChange = (e) => {
        const val = e.target.value
        if (e.target.name == 'question') {
            setTestquestion(val)
        }
        else if (e.target.name == 'year') {
            setTestyear(val)
        }
        else if (e.target.name == 'language') {
            setTestlanguage(val)
        }
    }

    useEffect(() => {
        setTestyear('select')
        setTestlanguage('select')
        if (testquestion) {
            let languageArr = []
            let yearArr = []
            for (const q of allquestions) {
                if (q.question_subject == testquestion) {
                    if (!languageArr.includes(q.question_language)) {
                        languageArr.push(q.question_language)
                    }
                    if (!yearArr.includes(q.year)) {
                        yearArr.push(q.year)
                    }
                }
            }
            setLanguages(languageArr)
            setYears(yearArr)
        }
    }, [testquestion])

    useEffect(() => {
        if (testquestion !== null && testyear !== null && testlanguage !== null && testquestion !== "select" && testyear !== "select" && testlanguage !== "select") {
            setDisabled(false)
        }
        else {
            setDisabled(true)
        }
    }, [testquestion, testlanguage, testyear])



    return (
        <div className='py-36 font-[ui-monospace] '>
            <ToastContainer
                position="bottom-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <Head>
                <title>Question-papers</title>
                <meta name="description" content="All Questions papers and practice sets for all exames" />
                <link rel="icon" href="/logo.png" />
            </Head>

            <div className='flex content-center justify-around items-center h-96  '>
                <div className='hidden sm:inline-block'>
                    <Image
                        src="/QandA.png"
                        alt="img"
                        width={300}
                        height={300}
                    />
                </div>
                <div>
                    <form className='w-64 md:w-[22rem]'>
                        <div className='flex flex-col'>
                            <label className='text-gray-200 mb-2' htmlFor="text">Select exam you would like to appear</label>
                            <select onChange={handleChange} name='question' className='mb-8 bg-gray-200 outline-none p-1'
                            >
                                <option value="select">--Select--</option>
                                {questions.map((e) => {
                                    return <option value={e} key={e} >{e}</option>
                                })}
                            </select>
                            <label className='text-gray-200 mb-2' htmlFor="text">Year</label>
                            <select onChange={handleChange} name='year' className='bg-gray-200 p-1 mb-8 outline-none'  >
                                <option value="select">--Select--</option>
                                {years && years.map((e) => {
                                    return <option value={e} key={e}>{e}</option>
                                    // return <option value={e} key={e}>shyam</option>
                                })}
                            </select>
                            <label className='text-gray-200 mb-2' htmlFor="text">Language</label>
                            <select onChange={handleChange} name='language' className='bg-gray-200 p-1 outline-none'
                            >
                                <option value="select">--Select--</option>
                                {languages && languages.map((e) => {
                                    return <option value={e} key={e} >{e}</option>
                                })}
                            </select>

                            {<Link href={`${process.env.NEXT_PUBLIC_HOST}/slug/${testquestion}?year=${testyear}&language=${testlanguage}&questionNum=0`}><button disabled={disabled} type="submit" className='disabled:opacity-[0.4] shadow-md py-2 mt-7 text-white border rounded-md hover:bg-gray-300 duration-300 
               hover:text-black transition-all border-white'>Start Test</button></Link>}
                        </div>
                    </form>
                </div>

            </div >
        </div >
    )
}

export async function getServerSideProps(context) {
    connectToDatabase()
    const questions = await Question.find()
    let questionsArr = []
    for (const question of questions) {
        if (!questionsArr.includes(question.question_subject)) {
            questionsArr.push(question.question_subject)
        }

    }
    return {
        props: { all_questions: JSON.parse(JSON.stringify(questions)), question_sub: JSON.parse(JSON.stringify(questionsArr)) }
    }
}


export default tests