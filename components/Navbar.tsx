'use client';
import { UserButton, useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl">
          <img src="/logo.svg" className="h-8 mr-2" alt="Logo" />
          MealAI
        </Link>
      </div>
      <div className="flex-none gap-4">
        {isSignedIn && (
          <>
            <Link href="/dashboard" className="btn btn-ghost">
              Dashboard
            </Link>
            <Link href="/history" className="btn btn-ghost">
              History
            </Link>
          </>
        )}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <div className="i-ph-user-circle-duotone w-6 h-6" />
            )}
          </div>
          {!isSignedIn && (
            <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li>
                <Link href="/sign-in">Sign In</Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}