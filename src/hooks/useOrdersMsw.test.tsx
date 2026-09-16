import { describe, it, expect, vi, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import type { Mock } from 'vitest';
import { renderHook } from '@testing-library/react-hooks';
import { MemoryRouter } from 'react-router-dom';
import { useSession, SessionProvider } from '../context/AuthContext';
import useOrders from './useOrders';

vi.mock('../context/AuthContext', async () => {
    const actual = await vi.importActual('../context/AuthContext');
    return {
        ...actual,
        useSession: vi.fn()
    };
});

const mockedUserSession = useSession as Mock;
describe('UseOrders with Msw', async () => {
    const mockedUser = {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "username": "superadmin",
        "email": "superadmin@example.com",
        "password": "superadmin123!",
        "role": "superadmin",
        "firstName": "John",
        "lastName": "Doe",
        "lastLogin": "2023-10-12T08:30:00Z",
        "createdAt": "2023-01-01T00:00:00Z",
        "status": "active"
    };
    beforeEach(() => {
        mockedUserSession.mockReturnValue({ user: mockedUser });
    });

    const hookWrapper = ({ children }: { children: React.ReactNode }) => (
        <SessionProvider>
            <MemoryRouter>
                {children}
            </MemoryRouter>
        </SessionProvider>
    );

    it('deberia optener la data del msw', async () => {
        const { result, waitForNextUpdate } = renderHook(() => useOrders(), { wrapper: hookWrapper });
        expect(result.current.loading).toBe(true);
        await waitForNextUpdate();
        expect(result.current.orders.length).toBe(1)
    });

    it('Deberia dar error en msw', async () => {
        server.use(
            http.get('http://localhost:3001/orders', () => {
                return new HttpResponse(null, {
                    status: 500,
                    statusText: 'Internal server error'
                })
            })
        );
         const { result, waitForNextUpdate } = renderHook(() => useOrders(), { wrapper: hookWrapper });
         expect(result.current.loading).toBe(true);
         await waitForNextUpdate();
         expect(result.current.error).toBe('Failed to fetch orders. Please try again later.');
    })
});