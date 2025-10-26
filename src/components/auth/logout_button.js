'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg 
                 hover:bg-red-700 transition-colors duration-200 font-semibold"
    >
      <LogOut size={18} />
      Cerrar Sesión
    </button>
  );
}