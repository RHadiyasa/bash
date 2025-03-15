import { Snippet } from '@heroui/snippet';
import { Code } from '@heroui/code';

import { title, subtitle } from '@/shared/components/primitives';
import { Navbar } from '@/shared/components/navbar';

export default function Home() {
  return (
    <div className="relative flex flex-col h-screen">
      <Navbar />
      <main className="container mx-auto flex flex-col items-center justify-center gap-4 py-8 md:py-10 h-screen">
        <div className="inline-block max-w-xl text-center justify-center">
          <span className={title()}>Welcome to&nbsp;</span>
          <span className={title({ color: 'blue', class: 'font-[900]' })}>BashApp&nbsp;</span>
          <br />
          <span className={title()}>Aplikasi Bank Sampah</span>
          <div className={subtitle({ class: 'mt-4' })}>Dari Rakyat, Untuk Rakyat, Oleh Rakyat.</div>
        </div>

        <div className="mt-8">
          <Snippet hideCopyButton hideSymbol variant="bordered">
            <span>Rakyat Bantu Rakyat © 2025 Budimind. All rights reserved.</span>
          </Snippet>
        </div>
      </main>
    </div>
  );
}
