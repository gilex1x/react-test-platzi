import { describe, it, expect, vi } from 'vitest';
import type { Mock } from "vitest";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { renderHook } from '@testing-library/react-hooks';
import { useSession } from "../context/AuthContext";
import { getOrders } from "../services/getOrders";
import useOrders from './useOrders';

vi.mock('../services/getOrders', () => ({
    getOrders: vi.fn()
}));

vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn()
}));

vi.mock('../context/AuthContext', async () => {
    const actual = await vi.importActual('../context/AuthContext');
    return {
        ...actual,
        useSession: vi.fn()
    }
});


const mockedNavigate = vi.fn();
const mockedUseSession = useSession as Mock;
const mockedGetOrders = getOrders as Mock;
const mockedOrders = [{
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "customer": {
        "id": "60d07f61-99bf-4b90-955b-5d3a7c9bb3d4",
        "name": "John Doe",
        "email": "john.doe@example.com"
    },
    "products": [
        {
            "id": "7567ec4b-b10c-48c5-9345-fc73c48a80a2",
            "name": "Laptop",
            "price": 999.99,
            "quantity": 1
        },
        {
            "id": "7567ec4b-b10c-48c5-9345-fc73c48a80a3",
            "name": "Mouse",
            "price": 29.99,
            "quantity": 1
        }
    ],
    "total": 1029.98,
    "status": "delivered",
    "orderDate": "2023-10-01T10:00:00Z",
    "shippingAddress": {
        "street": "123 Main St",
        "city": "Anytown",
        "state": "CA",
        "zipCode": "12345",
        "country": "USA"
    },
    "paymentMethod": "credit_card"
},];


describe('HooksTest:useOrders', () => {
    it('Deberia obtener las ordenes', async () => {
          mockedGetOrders.mockResolvedValue(mockedOrders);
        mockedUseSession.mockReturnValue({
            user: {
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
            }
        });
        const { result, waitForNextUpdate } = renderHook(() => useOrders());
        expect(result.current.loading).toBe(true);
        await waitForNextUpdate();
        expect(result.current.loading).toBe(false);
    })
});