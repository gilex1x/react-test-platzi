import { describe, it, expect, vi } from "vitest";
import type { Mock } from "vitest";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SessionProvider } from "../../context/AuthContext";
import { Login } from "./Login";
import { getAuth } from "../../services/getAuth";
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate
    }
})

vi.mock('../../services/getAuth', () => ({
    getAuth: vi.fn()
}));

const mockGetAuth = getAuth as Mock;
const mockNavigate = vi.fn();
describe('<Login/>', async () => {
    const handleLogin = async () => {
        return await render(
            <SessionProvider>
                <MemoryRouter>
                    <Login />
                </MemoryRouter>
            </SessionProvider>
        );
    }
    it('Mensaje de error', async () => {
        mockGetAuth.mockRejectedValue(new Error('Invalid credentials'))
        await handleLogin();
        // get inputs
        await act(() => {
            const userNameInput: HTMLElement = screen.getByPlaceholderText('Username');
            const passwordInput: HTMLElement = screen.getByPlaceholderText('Password');
            const submitButton: HTMLElement = screen.getByRole('button', { name: 'Login' });
            fireEvent.change(userNameInput, { target: { value: 'randomuser' } });
            fireEvent.change(passwordInput, { target: { value: 'randompass' } });
            fireEvent.click(submitButton)
        });
        const errorMessage = screen.getByText('Invalid credentials');
        expect(errorMessage).toBeInTheDocument();
    });

    it('Should do login and move to /orders', async () => {
        mockGetAuth.mockResolvedValue({ success: true });

        await handleLogin();
        // get inputs
        await act(() => {
            const userNameInput: HTMLElement = screen.getByPlaceholderText('Username');
            const passwordInput: HTMLElement = screen.getByPlaceholderText('Password');
            const submitButton: HTMLElement = screen.getByRole('button', { name: 'Login' });
            fireEvent.change(userNameInput, { target: { value: 'randomuser' } });
            fireEvent.change(passwordInput, { target: { value: 'randompass' } });
            fireEvent.click(submitButton)
        });
        await waitFor(() => {
            expect(mockGetAuth).toHaveBeenCalledWith('randomuser', 'randompass');
            expect(mockNavigate).toHaveBeenCalledWith('/orders')
        })
    });

    it('Should toggle text', async () => {
        await handleLogin();
        const passwordInput: HTMLElement = screen.getByPlaceholderText('Password');

        expect(passwordInput.getAttribute('type')).toBe(`password`);
        const toggleButton: HTMLElement = screen.getByText(`show`);
        await act(() => {
            fireEvent.click(toggleButton);
        });
        await waitFor(()=>{
            expect(passwordInput.getAttribute('type')).toBe(`text`);
            expect(screen.getByText('hide')).toBeInTheDocument();
        });
        const hideButton = screen.getByText('hide');
        await act(() => {
            fireEvent.click(hideButton);
        });

        await waitFor(()=>{
            expect(passwordInput.getAttribute('type')).toBe('password');
            expect(screen.getByText('show')).toBeInTheDocument();

        })
    });
})