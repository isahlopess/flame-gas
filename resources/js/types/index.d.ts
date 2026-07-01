export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    role: 'customer' | 'employee' | 'manager';
    phone?: string;
    address?: string;
    city?: string;
    neighborhood?: string;
    complement?: string;
    avatar?: string;
    vehicle_type?: string;
    vehicle_plate?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
