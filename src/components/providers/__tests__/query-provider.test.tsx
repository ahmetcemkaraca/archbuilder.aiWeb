import { describe, expect, it } from '@jest/globals';
import { useQuery } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryProvider } from '../query-provider';

const TestComponent = () => {
    const { data, isSuccess } = useQuery({
        queryKey: ['sample-query'],
        queryFn: async () => 'ArchBuilder',
    });

    if (!isSuccess) {
        return null;
    }

    return <span>{data}</span>;
};

describe('QueryProvider', () => {
    it('provides react-query context to descendants', async () => {
        render(
            <QueryProvider>
                <TestComponent />
            </QueryProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('ArchBuilder')).toBeTruthy();
        });
    });
});
