'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { useTheme } from '@/context/ThemeContext';

interface Option {
    _id?: string;
    id?: string;
    text: string;
    underlinedIndexes?: number[];
}

interface TestQuestion {
    _id?: string;
    id?: string;
    type: string;
    questionText: string;
    options: Option[];
    correctAnswer?: string;
    underlinedIndexes?: number[][];
}

interface FreeTest {
    id?: string;
    title: string;
    questions: TestQuestion[];
    timeLimit?: number;
    readingPassage?: string;
}

import { getFreeTest } from '@/api/testFree';
import { saveTestResult } from '@/api/userTest';

interface TestDisplayProps {
    testId: string;
    userEmail: string;
}

export default function TestDisplay({ testId, userEmail }: TestDisplayProps) {
    const { isDarkMode } = useTheme();
    const [test, setTest] = useState<FreeTest | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentAnswers, setCurrentAnswers] = useState<Record<string, string>>({});
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [score, setScore] = useState<number>(0);
    const [correctAnswers, setCorrectAnswers] = useState<Record<string, string>>({});
    const [timeRemaining, setTimeRemaining] = useState<number>(45 * 60);
    const router = useRouter();

    const [currentQuestionType, setCurrentQuestionType] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<Record<string, number>>({});
    const questionsPerPage = 2;

    const [startTime] = useState<Date>(new Date());
    const calculateTimeTaken = () => {
        const endTime = new Date();
        const diffInSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
        return {
            minutes: Math.floor(diffInSeconds / 60),
            seconds: diffInSeconds % 60,
            totalSeconds: diffInSeconds
        };
    };

    useEffect(() => {
        const loadTest = async () => {
            try {
                setLoading(true);
                Swal.fire({
                    title: 'Test loading...',
                    html: 'Please wait...',
                    didOpen: () => {
                        Swal.showLoading();
                    },
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    allowEnterKey: false,
                    showConfirmButton: false
                });

                const testData = await getFreeTest();
                setTest(testData);

                const answers: Record<string, string> = {};
                testData.questions.forEach(question => {
                    if (question.correctAnswer) {
                        answers[question.id] = question.correctAnswer;
                    }
                });
                setCorrectAnswers(answers);

                const questionTypes = getUniqueQuestionTypes(testData.questions);
                const initialPages: Record<string, number> = {};
                questionTypes.forEach(type => {
                    initialPages[type] = 0;
                });
                setCurrentPage(initialPages);
                if (questionTypes.length > 0) {
                    setCurrentQuestionType(questionTypes[0]);
                }
                Swal.close();
            } catch (err) {
                setError('Failed to load test. Please try again later.');
                console.error(err);
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Cannot load test. Please try again later.',
                    confirmButtonText: 'Back to home',
                    confirmButtonColor: '#3085d6'
                }).then((result) => {
                    if (result.isConfirmed) {
                        router.push('/');
                    }
                });
            } finally {
                setLoading(false);
            }
        };

        loadTest();
    }, [testId, router]);

     const handleSubmitTest = useCallback(async (): Promise<void> => {
        if (!userEmail || !test) return;

        // Confirmation dialog
        if (!isSubmitted) {
            const result = await Swal.fire({
                title: 'Submit Test?',
                text: "Are you sure you want to submit the test?",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Submit',
                cancelButtonText: 'Back to test'
            });

            if (!result.isConfirmed) {
                return;
            }
        }

        const finalScore = calculateScore();

        try {
            Swal.fire({
                title: 'Processing...',
                html: 'Please wait...',
                didOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                showConfirmButton: false
            });
            await saveTestResult({
                email: userEmail,
                score: finalScore,
                totalQuestions: test.questions.length,
                timeTaken: calculateTimeTaken() 
            });
            setScore(finalScore);
            setIsSubmitted(true);
            setError(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });

            Swal.fire({
                title: 'Done!',
                html: `<div class="text-center">
                        <p class="text-xl mb-3">Your score: <span class="font-bold text-blue-600">${finalScore}/${test.questions.length}</span></p>
                        <p class="text-lg">Correct: <span class="font-bold text-blue-600">${Math.round((finalScore / test.questions.length) * 100)}%</span></p>
                      </div>`,
                icon: 'success',
                confirmButtonText: 'Detail',
                confirmButtonColor: '#3085d6',
            });

        } catch (err) {
            setError('An error occurred while saving the test result.');
            console.error('Saving the test result error: ', err);

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while saving the test result. Please try again later.',
                confirmButtonText: 'Try again',
                confirmButtonColor: '#3085d6'
            });
        }
     }, [userEmail, test, isSubmitted, currentAnswers, correctAnswers, startTime]);
    useEffect(() => {
        if (loading || isSubmitted) return;

        const timer = setInterval(() => {
            setTimeRemaining((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    handleSubmitTest();
                    return 0;
                }

                if (prevTime === 300) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Warning',
                        text: 'You have 5 minutes left to submit the test.',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true
                    });
                }

                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [loading, isSubmitted, handleSubmitTest]);

    const handleAnswerChange = (questionId: string, answer: string): void => {
        setCurrentAnswers(prev => ({
            ...prev,
            [questionId]: answer,
        }));
        Swal.fire({
            title: 'Saved',
            text: 'Your answer has been saved.',
            toast: true,
            position: 'bottom-end',
            icon: 'success',
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true
        });
    };

    const calculateScore = (): number => {
        if (!test) return 0;

        let correctCount = 0;
        test.questions.forEach(question => {
            const userAnswer = currentAnswers[question.id];
            const correctAnswer = correctAnswers[question.id];

            if (userAnswer === correctAnswer) {
                correctCount++;
            }
        });

        return correctCount;
    };

    const isAllQuestionsAnswered = (): boolean => {
        if (!test) return false;
        return test.questions.every(question => currentAnswers[question.id]);
    };

   

    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const renderUnderlinedText = (text: string, indexes: number[] | undefined): React.ReactNode => {
        if (!indexes || indexes.length === 0) return text;

        const result: React.ReactNode[] = [];
        let lastIndex = 0;

        for (let i = 0; i < indexes.length; i += 2) {
            const start = indexes[i];
            const end = indexes[i + 1];

            result.push(text.substring(lastIndex, start));
            result.push(<u key={i} className="font-medium">{text.substring(start, end + 1)}</u>);

            lastIndex = end + 1;
        }

        if (lastIndex < text.length) {
            result.push(text.substring(lastIndex));
        }

        return <>{result}</>;
    };

    const renderErrorIdentificationText = (text: string, underlinedIndexes: number[][] | undefined): React.ReactNode => {
        if (!underlinedIndexes || !Array.isArray(underlinedIndexes) || underlinedIndexes.length === 0) {
            return text;
        }

        const parts: React.ReactNode[] = [];
        let lastEnd = 0;

        underlinedIndexes.forEach((indexPair, i) => {
            if (!Array.isArray(indexPair) || indexPair.length !== 2) {
                console.error('Invalid index pair:', indexPair);
                return;
            }

            const [start, end] = indexPair;
            if (start > lastEnd) {
                parts.push(<span key={`text-${i}`}>{text.substring(lastEnd, start)}</span>);
            }

            parts.push(
                <span key={`underlined-${i}`} className="option-text">
                    <u className="font-medium">{text.substring(start, end + 1)}</u>
                </span>
            );

            lastEnd = end + 1;
        });

        if (lastEnd < text.length) {
            parts.push(<span key="text-end">{text.substring(lastEnd)}</span>);
        }

        return <>{parts}</>;
    };

    const renderOptions = (question: TestQuestion, options: Option[]): React.ReactNode => {
        return options.map((option) => {
            const isOptionCorrect = isSubmitted && correctAnswers[question.id] === option.text;
            const isUserChoice = currentAnswers[question.id] === option.text;

            let optionClassName = `flex items-center space-x-3 p-3 rounded-md border transition-colors`;

            if (isSubmitted) {
                if (isOptionCorrect) {
                    optionClassName += isDarkMode
                        ? " bg-green-900 border-green-700"
                        : " bg-green-50 border-green-300";
                } else if (isUserChoice && !isOptionCorrect) {
                    optionClassName += isDarkMode
                        ? " bg-red-900 border-red-700"
                        : " bg-red-50 border-red-300";
                } else {
                    optionClassName += isDarkMode
                        ? " hover:bg-gray-700 border-gray-600"
                        : " hover:bg-gray-50 border-gray-200";
                }
            } else {
                optionClassName += isUserChoice
                    ? (isDarkMode ? " bg-blue-900 border-blue-700" : " bg-blue-50 border-blue-300")
                    : (isDarkMode ? " hover:bg-gray-700 border-gray-600" : " hover:bg-gray-50 border-gray-200");
            }

            return (
                <motion.label
                    key={option.id}
                    className={optionClassName}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <input
                        type="radio"
                        name={question.id}
                        value={option.text}
                        checked={currentAnswers[question.id] === option.text}
                        onChange={() => handleAnswerChange(question.id, option.text)}
                        className="form-radio text-blue-600 h-5 w-5"
                        disabled={isSubmitted}
                    />
                    <span className={`flex items-center flex-grow ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        {option.underlinedIndexes ?
                            renderUnderlinedText(option.text, option.underlinedIndexes) :
                            option.text
                        }
                        {isSubmitted && isOptionCorrect &&
                            <svg className="ml-2 h-5 w-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        }
                    </span>
                </motion.label>
            );
        });
    };

    const getUniqueQuestionTypes = (questions: TestQuestion[]): string[] => {
        const types = new Set<string>();
        questions.forEach(question => {
            let mainType = question.type;

            // Group similar question types
            if (mainType.includes('multiple_choice')) {
                mainType = 'multiple_choice';
            }

            types.add(mainType);
        });

        return Array.from(types);
    };

    const switchQuestionType = (type: string): void => {
        setCurrentQuestionType(type);
    };

    const handleNextPage = (type: string): void => {
        if (!test) return;

        const questions = test.questions.filter(q => {
            let mainType = q.type;
            if (mainType.includes('multiple_choice')) {
                mainType = 'multiple_choice';
            }
            return mainType === type;
        });

        const maxPages = Math.ceil(questions.length / questionsPerPage);

        if (currentPage[type] < maxPages - 1) {
            setCurrentPage(prev => ({
                ...prev,
                [type]: prev[type] + 1
            }));
        }
    };

    const handlePrevPage = (type: string): void => {
        if (currentPage[type] > 0) {
            setCurrentPage(prev => ({
                ...prev,
                [type]: prev[type] - 1
            }));
        }
    };

    const renderQuestionByType = (question: TestQuestion, index: number): React.ReactNode => {
        const isCorrect = isSubmitted && correctAnswers[question.id] === currentAnswers[question.id];

        const renderFeedback = (): React.ReactNode => {
            if (!isSubmitted) return null;

            if (isCorrect) {
                return (
                    <motion.div
                        className={`mt-3 p-2 ${isDarkMode ? 'bg-green-900 text-green-300 border-green-800' : 'bg-green-50 text-green-700 border-green-200'} font-medium rounded-md border`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                    >
                        <span className="flex items-center">
                            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Correct!
                        </span>
                    </motion.div>
                );
            }

            return (
                <motion.div
                    className={`mt-3 p-2 ${isDarkMode ? 'bg-red-900 text-red-300 border-red-800' : 'bg-red-50 text-red-700 border-red-200'} font-medium rounded-md border`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                >
                    <span className="flex items-center">
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Wrong, answer: {correctAnswers[question.id]}
                    </span>
                </motion.div>
            );
        };

        const renderQuestionCard = (content: React.ReactNode): React.ReactNode => (
            <motion.div
                className={`mb-8 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6 rounded-lg shadow-sm border`}
                key={question.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4 }}
            >
                <div className="space-y-4">
                    {content}
                    {renderFeedback()}
                </div>
            </motion.div>
        );

        if (question.type !== 'reading_comprehension') {
            const questionContent = (
                <>
                    <h3 className="text-lg font-medium mb-4 flex">
                        <span className="bg-blue-100 text-blue-800 font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3 shrink-0">
                            {index + 1}
                        </span>
                        {question.questionText}
                    </h3>
                    <div className="space-y-3 pl-11">
                        {renderOptions(question, question.options)}
                    </div>
                </>
            );

            return renderQuestionCard(questionContent);
        }
        return null;
    };

    const renderReadingComprehensionSection = (): React.ReactNode => {
        if (!test?.readingPassage) return null;

        const readingQuestions = test.questions.filter(q => q.type === 'reading_comprehension');
        if (readingQuestions.length === 0) return null;

        return (
            <motion.div
                className={`rounded-lg shadow-md border mb-8 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className={`p-4 rounded-t-lg border-b ${isDarkMode ? 'bg-blue-900 border-blue-800' : 'bg-blue-50 border-blue-100'}`}>
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>Reading</h3>
                </div>

                <div className="lg:flex">
                    <div className={`lg:w-1/2 p-6 lg:border-r ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className={`p-4 rounded-md border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                            <h4 className={`text-lg font-medium mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Reading Passage</h4>
                            <div className={`prose max-w-none break-words whitespace-pre-wrap ${isDarkMode ? 'text-gray-300' : ''}`}>
                                {test.readingPassage}
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/2 p-6">
                        <h4 className={`text-lg font-medium mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Questions</h4>
                        <div className="space-y-6">
                            {readingQuestions.map((question, idx) => {
                                const isCorrect = isSubmitted && correctAnswers[question.id] === currentAnswers[question.id];
                                const readingIndex = test.questions.findIndex(q => q.id === question.id);

                                return (
                                    <motion.div
                                        key={question.id}
                                        className={`border-b pb-6 last:border-b-0 last:pb-0 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3, delay: idx * 0.1 }}
                                    >
                                        <h3 className={`text-base font-medium mb-3 flex ${isDarkMode ? 'text-gray-200' : ''}`}>
                                            <span className="bg-blue-100 text-blue-800 font-bold rounded-full w-7 h-7 flex items-center justify-center mr-2 text-sm shrink-0">
                                                {readingIndex + 1}
                                            </span>
                                            {question.questionText}
                                        </h3>
                                        <div className="space-y-2 pl-9">
                                            {renderOptions(question, question.options)}
                                        </div>

                                        {isSubmitted && (
                                            <motion.div
                                                className={`mt-2 pl-9 text-sm font-medium ${isCorrect
                                                        ? isDarkMode ? 'text-green-400' : 'text-green-600'
                                                        : isDarkMode ? 'text-red-400' : 'text-red-600'
                                                    }`}
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                {isCorrect
                                                    ? 'Correct!'
                                                    : `Wrong! The correct answer: ${correctAnswers[question.id]}`
                                                }
                                            </motion.div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    const getMainSectionTitle = (type: string): string => {
        switch (type) {
            case 'pronunciation':
                return 'Pronunciation';
            case 'stress':
                return 'Word Stress';
            case 'fill_in_blank':
                return 'Fill in the Blanks';
            case 'error_identification':
                return 'Error Identification';
            case 'multiple_choice':
                return 'Multiple Choice';
            case 'reading_comprehension':
                return 'Reading Comprehension';
            default:
                return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        }
    };

    const renderQuestionNavigationTabs = (): React.ReactNode => {
        if (!test) return null;

        const questionTypes = getUniqueQuestionTypes(test.questions);

        return (
            <div className="flex overflow-x-auto mb-6 pb-2 gap-2">
                {questionTypes.map(type => {
                    const isActive = currentQuestionType === type;
                    const questions = test.questions.filter(q => {
                        let mainType = q.type;
                        if (mainType.includes('multiple_choice')) {
                            mainType = 'multiple_choice';
                        }
                        return mainType === type;
                    });
                    const answeredQuestions = questions.filter(q => currentAnswers[q.id]).length;

                    return (
                        <motion.button
                            key={type}
                            onClick={() => switchQuestionType(type)}
                            className={`px-4 py-2 rounded-md font-medium whitespace-nowrap ${isActive
                                    ? 'bg-blue-600 text-white'
                                    : isDarkMode
                                        ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {getMainSectionTitle(type)}
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${isActive
                                    ? 'bg-white text-blue-600'
                                    : isDarkMode
                                        ? 'bg-gray-600 text-gray-200'
                                        : 'bg-gray-200 text-gray-700'
                                }`}>
                                {answeredQuestions}/{questions.length}
                            </span>
                        </motion.button>
                    );
                })}
            </div>
        );
    };

    const renderCurrentQuestions = (): React.ReactNode => {
        if (!test) return null;

        // Don't render this section for reading comprehension
        if (currentQuestionType === 'reading_comprehension') {
            return renderReadingComprehensionSection();
        }

        // Get questions of the current type
        const questions = test.questions.filter(q => {
            let mainType = q.type;
            if (mainType.includes('multiple_choice')) {
                mainType = 'multiple_choice';
            }
            return mainType === currentQuestionType;
        });

        if (questions.length === 0) return null;

        // Calculate pagination
        const startIdx = currentPage[currentQuestionType] * questionsPerPage;
        const endIdx = Math.min(startIdx + questionsPerPage, questions.length);
        const currentQuestions = questions.slice(startIdx, endIdx);
        const totalPages = Math.ceil(questions.length / questionsPerPage);

        return (
            <motion.div
                className="space-y-6"
                key={currentQuestionType + currentPage[currentQuestionType]}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className={`${isDarkMode ? 'bg-blue-900 border-blue-800' : 'bg-blue-50 border-blue-100'} p-3 rounded-lg mb-4 border`}>
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                        {getMainSectionTitle(currentQuestionType)}
                    </h3>
                </div>

                <AnimatePresence mode="wait">
                    <div className="space-y-6">
                        {currentQuestions.map((question) =>
                            renderQuestionByType(question, test.questions.findIndex(q => q.id === question.id))
                        )}
                    </div>
                </AnimatePresence>

                {/* Pagination controls */}
                <div className="flex justify-between items-center mt-6">
                    <motion.button
                        onClick={() => handlePrevPage(currentQuestionType)}
                        disabled={currentPage[currentQuestionType] === 0}
                        className={`px-4 py-2 rounded-md flex items-center ${currentPage[currentQuestionType] === 0
                                ? isDarkMode
                                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : isDarkMode
                                    ? 'bg-blue-900 text-blue-300 hover:bg-blue-800'
                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                        whileHover={currentPage[currentQuestionType] !== 0 ? { scale: 1.05 } : {}}
                        whileTap={currentPage[currentQuestionType] !== 0 ? { scale: 0.95 } : {}}
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                        </svg>
                        Câu trước
                    </motion.button>

                    <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Trang {currentPage[currentQuestionType] + 1} / {totalPages}
                    </div>

                    <motion.button
                        onClick={() => handleNextPage(currentQuestionType)}
                        disabled={currentPage[currentQuestionType] >= totalPages - 1}
                        className={`px-4 py-2 rounded-md flex items-center ${currentPage[currentQuestionType] >= totalPages - 1
                                ? isDarkMode
                                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : isDarkMode
                                    ? 'bg-blue-900 text-blue-300 hover:bg-blue-800'
                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                        whileHover={currentPage[currentQuestionType] < totalPages - 1 ? { scale: 1.05 } : {}}
                        whileTap={currentPage[currentQuestionType] < totalPages - 1 ? { scale: 0.95 } : {}}
                    >
                        Câu sau
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </motion.button>
                </div>
            </motion.div>
        );
    };

    const renderQuestionCount = (): React.ReactNode => {
        if (!test) return null;

        const totalQuestions = test.questions.length;
        const answeredQuestions = Object.keys(currentAnswers).length;

        return (
            <div className={`flex items-center justify-between p-4 rounded-lg shadow-sm border mb-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    <div>
                        <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Answered questions</div>
                        <div className={`text-lg font-bold ${isDarkMode ? 'text-gray-200' : ''}`}>{answeredQuestions}/{totalQuestions}</div>
                    </div>
                </div>

                <div className={`w-48 rounded-full h-2.5 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <motion.div
                        className="bg-blue-600 h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>

                <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                        <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Time remaining</div>
                        <div className={`text-lg font-bold ${isDarkMode ? 'text-gray-200' : ''}`}>{formatTime(timeRemaining)}</div>
                    </div>
                </div>
            </div>
        );
    };

    const renderTestSummary = (): React.ReactNode => {
        const timeTaken = calculateTimeTaken();
        if (!test || !isSubmitted) return null;

        const totalQuestions = test.questions.length;
        const scorePercentage = Math.round((score / totalQuestions) * 100);

        return (
            <motion.div
                className={`rounded-lg shadow-md border p-6 mb-8 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Test Result</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className={`rounded-lg p-4 border ${isDarkMode ? 'bg-blue-900 border-blue-800' : 'bg-blue-50 border-blue-100'
                        }`}>
                        <div className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-blue-300' : 'text-blue-500'}`}>Score</div>
                        <div className={`text-2xl font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>{score}/{totalQuestions}</div>
                    </div>

                    <div className={`rounded-lg p-4 border ${isDarkMode ? 'bg-green-900 border-green-800' : 'bg-green-50 border-green-100'
                        }`}>
                        <div className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-green-300' : 'text-green-500'}`}>Correct</div>
                        <div className={`text-2xl font-bold ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>{scorePercentage}%</div>
                    </div>

                    <div className={`rounded-lg p-4 border ${isDarkMode ? 'bg-purple-900 border-purple-800' : 'bg-purple-50 border-purple-100'
                        }`}>
                        <div className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-purple-300' : 'text-purple-500'}`}>Time taken</div>
                        <div className={`text-2xl font-bold ${isDarkMode ? 'text-purple-300' : 'text-purple-700'}`}>{timeTaken.minutes} m {timeTaken.seconds} s</div>
                    </div>
                </div>
            </motion.div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 p-4 rounded-lg text-red-700 border border-red-200">
                <h3 className="font-bold mb-2">Lỗi</h3>
                <p>{error}</p>
                <button
                    onClick={() => router.push('/')}
                    className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                    Quay về trang chủ
                </button>
            </div>
        );
    }

    if (!test) {
        return (
            <div className="bg-yellow-50 p-4 rounded-lg text-yellow-700 border border-yellow-200">
                <h3 className="font-bold mb-2">Cannot find the free test</h3>
                <p>Cannot fetch free test information. Please try again later.</p>
                <button
                    onClick={() => router.push('/')}
                    className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                >
                    Back to home
                </button>
            </div>
        );
    }

    return (
        <div className={`max-w-5xl mx-auto py-6 px-4 ${isDarkMode ? 'text-gray-200' : ''}`}>
            {/* Test Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>{test?.title}</h1>
                    {!isSubmitted && (
                        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600' + ' mt-1'}>Complete all questions within the time limit.</p>
                    )}
                </motion.div>
            </div>

            {/* Test Summary for submitted tests */}
            {renderTestSummary()}

            {/* Question Count Progress */}
            {!isSubmitted && renderQuestionCount()}

            {/* Question Type Tabs */}
            {renderQuestionNavigationTabs()}

            {/* Current Questions */}
            {renderCurrentQuestions()}

            {/* Submit Button */}
            {!isSubmitted && (
                <motion.div
                    className="sticky bottom-4 flex justify-end mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <motion.button
                        onClick={handleSubmitTest}
                        className={`px-6 py-3 rounded-lg font-bold shadow-lg flex items-center ${isAllQuestionsAnswered()
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {isAllQuestionsAnswered() ? (
                            <>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                                Submit
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                </svg>
                                Submit ({Object.keys(currentAnswers).length}/{test.questions.length} câu)
                            </>
                        )}
                    </motion.button>
                </motion.div>
            )}

            {/* Back to Top Button */}
            <motion.button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`fixed bottom-4 right-4 p-3 rounded-full shadow-lg border text-blue-600 ${isDarkMode
                        ? 'bg-gray-800 border-gray-700 hover:bg-gray-700'
                        : 'bg-white border-gray-200 hover:bg-blue-50'
                    }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                </svg>
            </motion.button>
        </div>
    );
}