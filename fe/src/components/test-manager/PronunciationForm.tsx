import React from 'react';
import { Question } from '@/api/testManager';

interface PronunciationFormProps {
    editedQuestion: Question;
    idExists: boolean;
    handleIdChange: (value: string) => void;
    handleQuestionTextChange: (value: string) => void;
    handleOptionChange: (index: number, value: string) => void;
    handleCorrectAnswerChange: (value: string) => void;
    handleUnderlinedIndexesChange: (optionIndex: number, startIdx: number, endIdx: number) => void;
}

export const PronunciationForm: React.FC<PronunciationFormProps> = ({
    editedQuestion,
    idExists,
    handleIdChange,
    handleQuestionTextChange,
    handleOptionChange,
    handleCorrectAnswerChange,
    handleUnderlinedIndexesChange
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
                <label htmlFor="question-text" className="block text-sm font-medium mb-1">Question Text</label>
                <textarea
                    id="question-text"
                    value={editedQuestion.questionText}
                    onChange={(e) => handleQuestionTextChange(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    rows={3}
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Options with Underlined Sections</label>
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
                            className="w-full p-2 border rounded-md mb-2 mt-1"
                        />

                        <div className="grid grid-cols-2 gap-2 mt-1">
                            <div>
                                <label htmlFor={`start-idx-${idx}`} className="block text-sm font-medium">Underline Start</label>
                                <input
                                    id={`start-idx-${idx}`}
                                    type="number"
                                    value={option.underlinedIndexes?.[0] || 0}
                                    onChange={(e) => {
                                        const startIdx = parseInt(e.target.value);
                                        const endIdx = option.underlinedIndexes?.[1] || 0;
                                        handleUnderlinedIndexesChange(idx, startIdx, endIdx);
                                    }}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                            <div>
                                <label htmlFor={`end-idx-${idx}`} className="block text-sm font-medium">Underline End</label>
                                <input
                                    id={`end-idx-${idx}`}
                                    type="number"
                                    value={option.underlinedIndexes?.[1] || 0}
                                    onChange={(e) => {
                                        const startIdx = option.underlinedIndexes?.[0] || 0;
                                        const endIdx = parseInt(e.target.value);
                                        handleUnderlinedIndexesChange(idx, startIdx, endIdx);
                                    }}
                                    className="w-full p-2 border rounded-md"
                                />
                            </div>
                        </div>

                        <div className="mt-2">
                            <label className="block text-sm font-medium">Preview</label>
                            <div className="p-2 bg-gray-50 rounded mt-1">
                                {option.text.substring(0, option.underlinedIndexes?.[0] || 0)}
                                <u>
                                    {option.text.substring(
                                        option.underlinedIndexes?.[0] || 0,
                                        (option.underlinedIndexes?.[1] || 0) + 1
                                    )}
                                </u>
                                {option.text.substring((option.underlinedIndexes?.[1] || 0) + 1)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};