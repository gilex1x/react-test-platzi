import { describe, it, expect, vi } from "vitest";
import type { Mock } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SessionProvider } from "../../context/AuthContext";
import { Login } from "./Login";
import { getAuth } from "../../services/getAuth";

vi.mock('../../services/getAuth',()=>({
    getAuth: vi.fn()
}));

const mockGetAuth = getAuth as Mock;

describe('<Login/>', () => {
    it('Mensaje de error', async () => {
        mockGetAuth.mockRejectedValue(new Error('Invalid credentials'))
         await render(
            <SessionProvider>
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            </SessionProvider>
        );
        // get inputs
        await act(()=>{
            const userNameInput = screen.getByPlaceholderText('Username');
            const passwordInput = screen.getByPlaceholderText('Password');
            const submitButton = screen.getByRole('button',{name:'Login'});
            fireEvent.change(userNameInput,{target:{value: 'randomuser'}});
            fireEvent.change(passwordInput,{target:{value: 'randompass'}});
            fireEvent.click(submitButton)
        });
        const errorMessage = screen.getByText('Invalid credentials');
        expect(errorMessage).toBeInTheDocument();
    });
})