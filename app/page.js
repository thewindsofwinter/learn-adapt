import Image from 'next/image'
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-jetBlack-400 to-jetBlack-600 text-platinum-500">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Interview InSight!</h1>
        <p className="text-lg mb-8">Explore and practice with us.</p>
        <div className="border text-vermillion-400 hover:text-vermillion-600 border-vermillion-400 hover:border-vermillion-600 rounded p-2">
          <Link href="/practice">
            Go to Practice Page
          </Link>
        </div>
      </div>
    </div>
  );
}
