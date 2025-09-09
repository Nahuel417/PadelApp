export interface Coach {
    hourly_rate: number;
    id: string;
    user: {
        last_name: string;
        first_name: string;
    };
}
