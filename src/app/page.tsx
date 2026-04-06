import Link from 'next/link';
import { Button } from '@/components/Button';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background animate-fadeIn">
      <main className="flex flex-col items-center justify-center flex-1 w-full max-w-4xl px-4 text-center">
        <h1 className="text-5xl font-extrabold leading-tight text-foreground md:text-6xl">
          Effortless Note-Taking for <span className="text-primary">Modern Minds</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-gray-300 md:text-xl">
          Capture your ideas, thoughts, and reminders with a beautifully simple and
          intuitive interface. Stay organized and boost your productivity.
        </p>
        <div className="mt-10">
          <Link href="/signup">
            <Button>
              Get Started for Free
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
