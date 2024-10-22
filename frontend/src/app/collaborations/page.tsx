import { Metadata } from "next";

export const runtime = 'edge';

export const metadata : Metadata = {
    title: "Collaborations",
}

export default function Collaborations() {
    return (
        <main>
            <header className="py-24">
            <div className="max-w-[1348px] w-full flex flex-col justify-between items-start mx-auto space-y-4 lg:space-y-0 h-auto">
                <h1 className="text-2xl sm:text-4xl font-bold w-full">
                    Próximamente...
                </h1>
                {/* <p className="text-2xl">
                    {description}
                </p> */}
            </div>
            </header>
        </main>
    );
}