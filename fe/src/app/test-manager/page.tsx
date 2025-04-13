'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Edit, Save, Loader, BookOpen, AlertTriangle, PenTool, Volume2,
    Edit3, List, Plus, X, Trash2, ChevronRight, ChevronDown,
    FileText, Bookmark, Type, ListChecks
} from 'lucide-react';
import {
    fetchTest,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    validateQuestion,
    FreeTest,
    Question,
    Option,
    updateTestBasicInfo
} from '@/api/testManager';
import { PronunciationForm } from '@/components/test-manager/PronunciationForm';
import { StressForm } from '@/components/test-manager/StressForm';
import { FillInBlankForm } from '@/components/test-manager/FillInBlankForm';
import { ErrorIdentificationForm } from '@/components/test-manager/ErrorIdentificationForm';
import { ReadingComprehensionForm } from '@/components/test-manager/ReadingComprehensionForm';
import { MultiChoiceForm } from '@/components/test-manager/MultiChoiceForm';
import { showSuccessToast } from '@/components/common/notifications/SuccessToast';
import { confirmDelete } from '@/components/common/notifications/ConfirmDialog';
import AdminGuard from '@/components/AdminGuard';

// Constants
const TEST_ID = '67e79f28f9e4c1541848651a';
const QUESTION_TYPES = {
    PRONUNCIATION: 'pronunciation',
    STRESS: 'stress',
    FILL_IN_BLANK: 'fill_in_blank',
    MULTI_CHOICE: 'multi_choice',
    ERROR_IDENTIFICATION: 'error_identification',
    READING_COMPREHENSION: 'reading_comprehension'
};

export default function TestManagerPage() {
    // State declarations
    const [test, setTest] = useState<FreeTest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
    const [groupedQuestions, setGroupedQuestions] = useState<Record<string, Question[]>>({});
    const [editedQuestion, setEditedQuestion] = useState<Question | null>(null);
    const [activeTab, setActiveTab] = useState<string>('');
    const [isAddingQuestion, setIsAddingQuestion] = useState(false);
    const [idExists, setIdExists] = useState(false);
    const [allQuestionIds, setAllQuestionIds] = useState<string[]>([]);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [hasDuplicateOptions, setHasDuplicateOptions] = useState<boolean>(false);
    const [isEditingTestInfo, setIsEditingTestInfo] = useState(false);
    const [editedTestInfo, setEditedTestInfo] = useState({
        title: '',
        readingPassage: ''
    });
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

    // Initialize test info and section expansion state
    useEffect(() => {
        if (test) {
            setEditedTestInfo({
                title: test.title || '',
                readingPassage: test.readingPassage || ''
            });

            // Initialize expanded sections
            const sections: Record<string, boolean> = {};
            Object.keys(test.questions.reduce((acc, q) => {
                acc[q.type] = true;
                return acc;
            }, {} as Record<string, boolean>)).forEach(type => {
                sections[type] = true;
            });
            setExpandedSections(sections);
        }
    }, [test]);

    // Fetch test data
    useEffect(() => {
        const loadTestData = async () => {
            try {
                setLoading(true);
                const data = await fetchTest(TEST_ID);
                setTest(data);

                const ids = data.questions.map((q: Question) => q.id);
                setAllQuestionIds(ids);

                // Group questions by type
                const grouped: Record<string, Question[]> = {};
                data.questions.forEach((question: Question) => {
                    if (!grouped[question.type]) {
                        grouped[question.type] = [];
                    }
                    grouped[question.type].push(question);
                });
                setGroupedQuestions(grouped);

                // Set first question type as active tab
                if (Object.keys(grouped).length > 0) {
                    setActiveTab(Object.keys(grouped)[0]);
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
                setError(errorMessage);
                showSuccessToast({
                    message: errorMessage,
                    type: "error",
                });
            } finally {
                setLoading(false);
            }
        };

        loadTestData();
    }, []);

    // Helper functions
    const generateUniqueId = useCallback(() => {
        const timestamp = new Date().getTime();
        const randomSuffix = Math.floor(Math.random() * 1000);
        return `q_${timestamp}_${randomSuffix}`;
    }, []);

    const checkDuplicateOptions = useCallback((options: Option[]): boolean => {
        const optionTexts = options.map(option => option.text.trim()).filter(text => text !== '');
        const uniqueOptions = new Set(optionTexts);
        return uniqueOptions.size !== optionTexts.length;
    }, []);

    const getQuestionTypeIcon = useCallback((type: string) => {
        switch (type) {
            case QUESTION_TYPES.PRONUNCIATION: return <Volume2 size={18} className="text-purple-500" />;
            case QUESTION_TYPES.STRESS: return <PenTool size={18} className="text-blue-500" />;
            case QUESTION_TYPES.FILL_IN_BLANK: return <Edit3 size={18} className="text-green-500" />;
            case QUESTION_TYPES.MULTI_CHOICE: return <ListChecks size={18} className="text-indigo-500" />;
            case QUESTION_TYPES.ERROR_IDENTIFICATION: return <AlertTriangle size={18} className="text-yellow-500" />;
            case QUESTION_TYPES.READING_COMPREHENSION: return <BookOpen size={18} className="text-red-500" />;
            default: return <FileText size={18} className="text-gray-500" />;
        }
    }, []);

    const getQuestionTypeName = useCallback((type: string) => {
        return type.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }, []);

    // Event handlers
    const handleQuestionTextChange = useCallback((value: string) => {
        if (!editedQuestion) return;
        setEditedQuestion(prev => prev ? { ...prev, questionText: value } : null);
    }, [editedQuestion]);

    const handleOptionChange = useCallback((index: number, value: string) => {
        if (!editedQuestion) return;

        setEditedQuestion(prev => {
            if (!prev) return null;

            const newOptions = [...prev.options];
            newOptions[index] = { ...newOptions[index], text: value };

            const hasDuplicates = checkDuplicateOptions(newOptions);
            setHasDuplicateOptions(hasDuplicates);

            return { ...prev, options: newOptions };
        });
    }, [editedQuestion, checkDuplicateOptions]);

    const handleCorrectAnswerChange = useCallback((value: string) => {
        if (!editedQuestion) return;
        setEditedQuestion(prev => prev ? { ...prev, correctAnswer: value } : null);
    }, [editedQuestion]);

    const handleErrorIdentificationChange = useCallback((index: number, startIdx: number, endIdx: number) => {
        if (!editedQuestion) return;

        setEditedQuestion(prev => {
            if (!prev) return null;

            const newUnderlined = [...(prev.underlinedIndexes || [])];
            newUnderlined[index] = [startIdx, endIdx];

            return {
                ...prev,
                underlinedIndexes: newUnderlined
            };
        });
    }, [editedQuestion]);

    const handleUnderlinedIndexesChange = useCallback((optionIndex: number, startIdx: number, endIdx: number) => {
        if (!editedQuestion) return;

        setEditedQuestion(prev => {
            if (!prev) return null;

            const newOptions = [...prev.options];
            const option = newOptions[optionIndex];

            option.underlinedIndexes = [startIdx, endIdx];
            newOptions[optionIndex] = option;

            return { ...prev, options: newOptions };
        });
    }, [editedQuestion]);

    const handleIdChange = useCallback((value: string) => {
        if (!editedQuestion) return;

        const exists = allQuestionIds.some(id =>
            id === value && (selectedQuestion ? id !== selectedQuestion.id : true)
        );

        setIdExists(exists);
        setEditedQuestion(prev => prev ? { ...prev, id: value } : null);
    }, [editedQuestion, allQuestionIds, selectedQuestion]);

    // Section toggle handler
    const toggleSection = useCallback((type: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    }, []);

    // Test info handlers
    const handleEditTestInfo = useCallback(() => {
        setIsEditingTestInfo(true);
    }, []);

    const handleCancelEditTestInfo = useCallback(() => {
        setIsEditingTestInfo(false);
        if (test) {
            setEditedTestInfo({
                title: test.title || '',
                readingPassage: test.readingPassage || ''
            });
        }
    }, [test]);

    const handleTestInfoChange = useCallback((field: string, value: string) => {
        setEditedTestInfo(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    const handleSaveTestInfo = useCallback(async () => {
        if (!test) return;

        setLoading(true);
        setError(null);

        try {
            await updateTestBasicInfo(test._id, editedTestInfo);
            const updatedTest = await fetchTest(TEST_ID);
            setTest(updatedTest);
            setIsEditingTestInfo(false);
            showSuccessToast({ message: 'Test information updated successfully' });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Update failed';
            setError(errorMessage);
            showSuccessToast({ message: errorMessage, type: 'error' });
        } finally {
            setLoading(false);
        }
    }, [test, editedTestInfo]);

    // Question management handlers
    const handleSelectQuestion = useCallback((question: Question) => {
        setSelectedQuestion(question);
        setEditedQuestion({
            ...JSON.parse(JSON.stringify(question)),
            id: question.id
        });
        setIsAddingQuestion(false);
        setValidationError(null);
        setHasDuplicateOptions(false);
    }, []);

    const handleAddNewQuestion = useCallback((type: string) => {
        const newId = generateUniqueId();
        const newQuestion: Question = {
            id: newId,
            type: type,
            questionText: '',
            options: [
                { text: '' },
                { text: '' },
                { text: '' },
                { text: '' }
            ],
            correctAnswer: ''
        };

        if (type === QUESTION_TYPES.ERROR_IDENTIFICATION) {
            newQuestion.underlinedIndexes = [
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0]
            ];
        }

        setSelectedQuestion(null);
        setEditedQuestion(newQuestion);
        setIsAddingQuestion(true);
        setValidationError(null);
        setHasDuplicateOptions(false);
    }, [generateUniqueId]);

    const handleDeleteQuestion = useCallback(async () => {
        if (!selectedQuestion || !test) return;

        await confirmDelete({
            itemName: 'Question',
            onConfirm: async () => {
                try {
                    setLoading(true);
                    await deleteQuestion(test._id, selectedQuestion.id);
                    setAllQuestionIds(prev => prev.filter(id => id !== selectedQuestion.id));

                    const updatedTest = await fetchTest(TEST_ID);
                    setTest(updatedTest);

                    // Regroup questions
                    const newGrouped: Record<string, Question[]> = {};
                    updatedTest.questions.forEach((question: Question) => {
                        if (!newGrouped[question.type]) {
                            newGrouped[question.type] = [];
                        }
                        newGrouped[question.type].push(question);
                    });
                    setGroupedQuestions(newGrouped);

                    showSuccessToast({ message: 'Question deleted successfully' });
                    setSelectedQuestion(null);
                    setEditedQuestion(null);
                } catch (err) {
                    const errorMessage = err instanceof Error ? err.message : 'Delete failed';
                    setError(errorMessage);
                    showSuccessToast({ message: errorMessage, type: 'error' });
                } finally {
                    setLoading(false);
                }
            }
        });
    }, [selectedQuestion, test]);

    const handleUpdateQuestion = useCallback(async () => {
        if (!editedQuestion || !test) return;

        // Validation
        if (idExists) {
            setValidationError('Question ID already exists. Please use a unique ID.');
            showSuccessToast({ message: 'Question ID already exists. Please use a unique ID.', type: 'error' });
            return;
        }

        if (!editedQuestion.questionText.trim()) {
            setValidationError('Question text is required.');
            showSuccessToast({ message: 'Question text is required.', type: 'error' });
            return;
        }

        if (!editedQuestion.correctAnswer.trim()) {
            setValidationError('You must select a correct answer.');
            showSuccessToast({ message: 'You must select a correct answer.', type: 'error' });
            return;
        }

        const hasDuplicates = checkDuplicateOptions(editedQuestion.options);
        if (hasDuplicates) {
            setHasDuplicateOptions(true);
            setValidationError('Options must be unique. Please remove duplicates.');
            showSuccessToast({ message: 'Options must be unique. Please remove duplicates.', type: 'error' });
            return;
        }

        const validation = validateQuestion(editedQuestion);
        if (!validation.valid) {
            setValidationError(validation.errorMessage || 'Invalid question data');
            showSuccessToast({ message: validation.errorMessage || 'Invalid question data', type: 'error' });
            return;
        }

        setLoading(true);
        setError(null);
        setValidationError(null);

        try {
            const questionToUpdate = {
                id: editedQuestion.id,
                type: editedQuestion.type,
                questionText: editedQuestion.questionText,
                options: editedQuestion.options.map(opt => ({
                    text: opt.text,
                    underlinedIndexes: opt.underlinedIndexes
                })),
                correctAnswer: editedQuestion.correctAnswer,
                ...(editedQuestion.underlinedIndexes && {
                    underlinedIndexes: editedQuestion.underlinedIndexes
                })
            };

            if (isAddingQuestion) {
                await addQuestion(test._id, questionToUpdate);
                setAllQuestionIds(prev => [...prev, editedQuestion.id]);
            } else {
                await updateQuestion(test._id, editedQuestion.id, questionToUpdate);
            }

            // Refresh test data
            const updatedTest = await fetchTest(TEST_ID);
            setTest(updatedTest);

            // Regroup questions
            const newGrouped: Record<string, Question[]> = {};
            updatedTest.questions.forEach((question: Question) => {
                if (!newGrouped[question.type]) {
                    newGrouped[question.type] = [];
                }
                newGrouped[question.type].push(question);
            });
            setGroupedQuestions(newGrouped);

            showSuccessToast({
                message: isAddingQuestion
                    ? "Question added successfully"
                    : "Question updated successfully",
            });

            // Reset state
            setSelectedQuestion(null);
            setEditedQuestion(null);
            setIsAddingQuestion(false);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Update failed';
            setError(errorMessage);
            showSuccessToast({
                message: errorMessage,
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    }, [editedQuestion, test, isAddingQuestion, idExists, checkDuplicateOptions, allQuestionIds]);

    // Form rendering functions
    const renderUpdateForm = useCallback(() => {
        if (!editedQuestion) return null;

        const commonProps = {
            editedQuestion,
            idExists,
            handleIdChange,
            handleQuestionTextChange,
            handleOptionChange,
            handleCorrectAnswerChange
        };

        switch (editedQuestion.type) {
            case QUESTION_TYPES.PRONUNCIATION:
                return (
                    <PronunciationForm
                        {...commonProps}
                        handleUnderlinedIndexesChange={handleUnderlinedIndexesChange}
                    />
                );
            case QUESTION_TYPES.STRESS:
                return <StressForm {...commonProps} />;
            case QUESTION_TYPES.FILL_IN_BLANK:
                return <FillInBlankForm {...commonProps} />;
            case QUESTION_TYPES.MULTI_CHOICE:
                return <MultiChoiceForm {...commonProps} />;
            case QUESTION_TYPES.ERROR_IDENTIFICATION:
                return (
                    <ErrorIdentificationForm
                        {...commonProps}
                        handleErrorIdentificationChange={handleErrorIdentificationChange}
                    />
                );
            case QUESTION_TYPES.READING_COMPREHENSION:
                return (
                    <ReadingComprehensionForm
                        {...commonProps}
                        readingPassage={test?.readingPassage || ''}
                    />
                );
            default:
                return (
                    <div className="p-4 bg-yellow-50 rounded-md border border-yellow-200">
                        <p>This question type is not supported in the editor yet.</p>
                    </div>
                );
        }
    }, [
        editedQuestion,
        test,
        idExists,
        handleIdChange,
        handleQuestionTextChange,
        handleOptionChange,
        handleCorrectAnswerChange,
        handleUnderlinedIndexesChange,
        handleErrorIdentificationChange
    ]);

    const renderQuestionDetails = useCallback(() => {
        if (!selectedQuestion) return null;

        return (
            <div className="bg-white p-4 rounded-md border shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                        <Bookmark size={18} className="text-indigo-500" />
                        Question Details
                    </h3>
                    <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                        {selectedQuestion.id}
                    </span>
                </div>

                <div className="space-y-3">
                    <div>
                        <h4 className="text-sm font-medium text-gray-500 flex items-center gap-1">
                            <Type size={14} /> Question Text
                        </h4>
                        <p className="mt-1 text-gray-700">{selectedQuestion.questionText}</p>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-gray-500 flex items-center gap-1">
                            <ListChecks size={14} /> Options
                        </h4>
                        <ul className="mt-1 space-y-1">
                            {selectedQuestion.options.map((opt, idx) => (
                                <li key={idx} className={`flex items-start gap-2 p-2 rounded ${opt.text === selectedQuestion.correctAnswer ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                                    <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs ${opt.text === selectedQuestion.correctAnswer ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                        {idx + 1}
                                    </span>
                                    <span className={opt.text === selectedQuestion.correctAnswer ? "font-medium text-green-700" : "text-gray-700"}>
                                        {opt.text}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="flex gap-2 mt-4">
                    <button
                        onClick={() => handleSelectQuestion(selectedQuestion)}
                        className="flex items-center gap-2 px-3 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors text-sm"
                    >
                        <Edit size={16} /> Edit Question
                    </button>
                    <button
                        onClick={handleDeleteQuestion}
                        className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
                    >
                        <Trash2 size={16} /> Delete
                    </button>
                </div>
            </div>
        );
    }, [selectedQuestion, handleSelectQuestion, handleDeleteQuestion]);

    // Loading and error states
    if (loading && !test) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-3">
                <Loader className="animate-spin text-indigo-500" size={32} />
                <span className="text-gray-600">Loading test data...</span>
            </div>
        );
    }

    if (error && !test) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-3">
                <AlertTriangle className="text-red-500" size={32} />
                <span className="text-gray-600">Error: {error}</span>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    // Main component render
    return (
        <AdminGuard>
            <div className="min-h-screen bg-gray-50 p-4 md:p-6">
                <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
                    {/* Test Header */}
                    <div className="p-6 border-b">
                        {isEditingTestInfo ? (
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="test-title" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                        <FileText size={16} /> Test Title
                                    </label>
                                    <input
                                        id="test-title"
                                        type="text"
                                        value={editedTestInfo.title}
                                        onChange={(e) => handleTestInfoChange('title', e.target.value)}
                                        className="w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="reading-passage" className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                        <BookOpen size={16} /> Reading Passage
                                    </label>
                                    <textarea
                                        id="reading-passage"
                                        value={editedTestInfo.readingPassage}
                                        onChange={(e) => handleTestInfoChange('readingPassage', e.target.value)}
                                        rows={6}
                                        className="w-full p-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Enter the reading passage text..."
                                    />
                                </div>

                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={handleCancelEditTestInfo}
                                        className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 text-gray-700"
                                    >
                                        <X size={16} /> Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveTestInfo}
                                        disabled={loading}
                                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
                                    >
                                        {loading ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-between items-center">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                        <FileText size={24} className="text-indigo-500" />
                                        {test?.title || 'Test Manager'}
                                    </h1>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {test?.questions.length || 0} questions in this test
                                    </p>
                                </div>
                                <button
                                    onClick={handleEditTestInfo}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors"
                                >
                                    <Edit size={16} /> Edit Test Info
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
                        {/* Questions Sidebar */}
                        <div className="lg:col-span-1 border-r p-4 bg-gray-50 h-[calc(100vh-180px)] overflow-y-auto">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                                    <List size={18} /> Questions
                                </h2>
                                <button
                                    onClick={() => handleAddNewQuestion(activeTab)}
                                    className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm"
                                >
                                    <Plus size={16} /> Add New
                                </button>
                            </div>

                            <div className="space-y-2">
                                {Object.entries(groupedQuestions).map(([type, questions]) => (
                                    <div key={type} className="border rounded-md overflow-hidden">
                                        <button
                                            onClick={() => toggleSection(type)}
                                            className={`w-full flex justify-between items-center p-3 text-left font-medium ${activeTab === type ? 'bg-indigo-50 text-indigo-700' : 'bg-white text-gray-700'} hover:bg-gray-50`}
                                        >
                                            <div className="flex items-center gap-2">
                                                {getQuestionTypeIcon(type)}
                                                {getQuestionTypeName(type)}
                                                <span className="ml-1 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                                                    {questions.length}
                                                </span>
                                            </div>
                                            {expandedSections[type] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                        </button>

                                        {expandedSections[type] && (
                                            <div className="border-t">
                                                {questions.map((question) => (
                                                    <div
                                                        key={question.id}
                                                        onClick={() => {
                                                            handleSelectQuestion(question);
                                                            setActiveTab(type);
                                                        }}
                                                        className={`p-3 text-sm cursor-pointer transition-colors ${selectedQuestion?.id === question.id
                                                                ? 'bg-indigo-100 text-indigo-700'
                                                                : 'bg-white hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        <div className="truncate">{question.questionText || 'Untitled question'}</div>
                                                        <div className="text-xs text-gray-500 mt-1">ID: {question.id}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Question Editor/Viewer */}
                        <div className="lg:col-span-3 p-6 h-[calc(100vh-180px)] overflow-y-auto">
                            {editedQuestion ? (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                            {getQuestionTypeIcon(editedQuestion.type)}
                                            {isAddingQuestion ? 'Add New' : 'Edit'} {getQuestionTypeName(editedQuestion.type)} Question
                                        </h2>
                                        {!isAddingQuestion && (
                                            <button
                                                onClick={handleDeleteQuestion}
                                                className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors text-sm"
                                            >
                                                <Trash2 size={16} /> Delete
                                            </button>
                                        )}
                                    </div>

                                    {/* Validation error display */}
                                    {validationError && (
                                        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 flex items-start gap-2">
                                            <AlertTriangle size={20} className="mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="font-medium">Validation Error</p>
                                                <p className="text-sm">{validationError}</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Duplicate options warning */}
                                    {hasDuplicateOptions && (
                                        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700 flex items-start gap-2">
                                            <AlertTriangle size={20} className="mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="font-medium">Duplicate Options</p>
                                                <p className="text-sm">Options must be unique. Please remove duplicates.</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Render the appropriate form based on question type */}
                                    {renderUpdateForm()}

                                    {/* Action buttons */}
                                    <div className="flex justify-end gap-2 pt-4 border-t">
                                        <button
                                            onClick={() => {
                                                setEditedQuestion(null);
                                                setIsAddingQuestion(false);
                                                setValidationError(null);
                                            }}
                                            className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 text-gray-700"
                                        >
                                            <X size={16} /> Cancel
                                        </button>
                                        <button
                                            onClick={handleUpdateQuestion}
                                            disabled={loading || idExists}
                                            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
                                        >
                                            {loading ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
                                            {isAddingQuestion ? 'Add Question' : 'Save Changes'}
                                        </button>
                                    </div>
                                </div>
                            ) : selectedQuestion ? (
                                // Display selected question details when not editing
                                renderQuestionDetails()
                            ) : (
                                // Initial state or when no question is selected
                                <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
                                    <div className="bg-indigo-50 p-6 rounded-full">
                                        <FileText size={48} className="text-indigo-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-medium text-gray-700">Question Manager</h3>
                                                <p className="text-gray-500 mt-2 max-w-md">
                                                    Select a question from the sidebar to view or edit, or click &quot;Add New&quot; to create a new question.
                                                </p>
                                    </div>
                                    {Object.keys(groupedQuestions).length > 0 && (
                                        <button
                                            onClick={() => handleAddNewQuestion(activeTab)}
                                            className="mt-4 flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                        >
                                            <Plus size={18} /> Add New Question
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminGuard>
    );
}