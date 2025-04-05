import { Snippet } from '@heroui/snippet';
import { motion } from 'framer-motion';
import { Code } from '@heroui/code';

import { title, subtitle } from '@/shared/components/primitives';
import { Navbar } from '@/shared/components/navbar';

export default function Home() {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto flex flex-col items-center justify-center gap-4 py-8 px-10 md:py-10 h-screen">
        <div className="inline-block max-w-2xl text-center justify-center">
          <span className="text-5xl font-extrabold">Welcome to&nbsp;</span>
          <span className="text-5xl font-extrabold bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
            Swantara&nbsp;
          </span>
          <span className="text-5xl font-extrabold">Bank Sampah Web Application</span>
          <br />

          <div className="mt-2 font-semibold text-lg text-gray-400">Swakarya, Santara, Tarasa</div>
          
        </div>
      </main>
      <footer className="flex items-center justify-center py-10">
        <div>
          <Snippet hideCopyButton hideSymbol variant="bordered" size="sm" className="p-2 md:p-3">
            <span className="text-xs">Rakyat Bantu Rakyat © 2025 Budimind. All rights reserved.</span>
          </Snippet>
        </div>
      </footer>
    </div>
  );
}
