import { ReactNode } from 'react';

export const runtime = 'edge';

export default function ArticleLayout({ children }: { children: ReactNode }) {
    return (
        <div className="max-w-[1342px] w-full mx-auto mb-20">
            {children}
        </div>
    );
}