import { ReactNode } from 'react';

export const runtime = 'edge';

export default function ArticleLayout({ children }: { children: ReactNode }) {
    return (
        <div className="max-w-[1342px] w-full mx-auto py-8">
            {children}
        </div>
    );
}