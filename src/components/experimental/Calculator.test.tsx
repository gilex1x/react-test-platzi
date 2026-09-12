import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Calculator } from './Calculator';

describe('<Calculator/>', () => {
    const useCasesTest = [
        { a: 1, b: 2, operation: "add", expected: 3 },
        { a: 3, b: 4, operation: "multiply", expected: 12 },
        {a:10,b:5,operation:"subtract", expected:5},
        {a:100,b:5,operation:"divide", expected:20},
    ];
    it.each(useCasesTest)('$expected para $a y $b son $operation', async({ a, b, operation, expected }) => {
        const {getByText}=await render(<Calculator a={a} b={b} operation={operation} />);
        const result = getByText(`Result: ${expected}`);
        expect(result).toBeInTheDocument();
    })
})