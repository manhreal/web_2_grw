import React from 'react';
import { Question } from '@/api/testManager';

interface ErrorIdentificationFormProps {
    editedQuestion: Question;
    idExists: boolean;
    handleIdChange: (value: string) => void;
    handleQuestionTextChange: (value: string) => void;
    handleOptionChange: (index: number, value: string) => void;
    handleCorrectAnswerChange: (value: string) => void;
}

export const ErrorIdentificationForm: React.FC<ErrorIdentificationFormProps> = ({
    editedQuestion,
    idExists,
    handleIdChange,
    handleQuestionTextChange,
    handleOptionChange,
    handleCorrectAnswerChange
}) => {
    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="question-id" className="block text-sm font-medium mb-1">Question ID</label>
                <div className="flex items-center">
                    <input
                        id="question-id"
                        value={editedQuestion.id}
                        onChange={(e) => handleIdChange(e.target.value)}
                        className={`w-full p-2 border rounded-md ${idExists ? 'border-red-500' : ''}`}
                    />
                    {idExists ? (
                        <span className="ml-2 text-red-500">✗</span>
                    ) : (
                        <span className="ml-2 text-green-500">✓</span>
                    )}
                </div>
                {idExists && <p className="text-red-500 text-xs mt-1">This ID already exists. Please use a unique ID.</p>}
            </div>

            <div>
                <label htmlFor="question-text" className="block text-sm font-medium mb-1">Sentence with Error</label>
                <textarea
                    id="question-text"
                    value={editedQuestion.questionText}
                    onChange={(e) => handleQuestionTextChange(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    rows={3}
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Error Options</label>
                {editedQuestion.options.map((option, idx) => (
                    <div key={idx} className="mt-2 p-3 border rounded-md">
                        <div className="flex items-center justify-between">
                            <label htmlFor={`option-${idx}`} className="block text-sm font-medium">Option {idx + 1}</label>
                            <input
                                type="checkbox"
                                id={`correct-${idx}`}
                                checked={editedQuestion.correctAnswer === option.text}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        handleCorrectAnswerChange(option.text);
                                    }
                                }}
                                className="h-4 w-4"
                            />
                        </div>

                        <input
                            id={`option-${idx}`}
                            type="text"
                            value={option.text}
                            onChange={(e) => handleOptionChange(idx, e.target.value)}
                            className="w-full p-2 border rounded-md mt-1"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};