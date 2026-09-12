import {describe, it, expect, vi} from 'vitest';
import {render, screen, fireEvent,act} from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from './Button';

describe('<Button /> tests',()=>{
    it('Deberia renderizra',()=>{
        render(<Button label='click'/>);
        const button = screen.getByText('click');
        expect(button).toBeInTheDocument();
    });
    it('Deberia hacer click',async()=>{
        //Patron Arrange Act Assert
        const handleClick = vi.fn();
        render(<Button label='click' onClick={handleClick}/>);
        const button = screen.getByText('click');
        await act(()=>{
            fireEvent.click(button)
        })
        expect(handleClick).toHaveBeenCalledTimes(1);
    })
})