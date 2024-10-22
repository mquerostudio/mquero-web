import { ReactNode } from 'react';

export const runtime = 'edge';

export default function ArticleLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col items-center px-10">
            {children}
        </div>
    );
}