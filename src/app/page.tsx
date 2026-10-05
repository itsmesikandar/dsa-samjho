import Link from 'next/link';
import { allTopics, getNav } from '@/lib/content';
import { ChapterProgress, ContinueCard } from '@/components/home/client';

const STEPS = [
  { t: 'Padho', d: 'Har topic simple Hinglish mein, roz ki life ke example ke saath.' },
  { t: 'Dekho', d: 'Animation ko step-by-step chalao. Har step pe likha hai KYUN.' },
  { t: 'Khud chalao', d: '"Apna input try karo" se apne numbers daalo aur dekho kya hota hai.' },
  { t: 'Practice', d: 'Interview questions, quiz aur LeetCode/GFG problems se pakka karo.' },
];

export default function Home() {
  const nav = getNav();
  const topics = allTopics();
  const first = topics.find((t) => t.available);
  const titles = Object.fromEntries(topics.map((t) => [t.href, t.title]));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-10">
      <section className="mb-10">
        <p className="mb-2 font-mono text-sm text-accent">DSA, bilkul zero se</p>
        <h1 className="text-3xl leading-tight font-extrabold tracking-tight sm:text-5xl">
          Dekh ke samjho,
          <br />
          phir interview crack karo.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Data Structures & Algorithms simple Hinglish mein. Har concept ka animation, Kotlin + Java code, aur interview ki poori taiyari.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {first && (
            <Link href={first.href} className="rounded-lg bg-accent px-5 py-3 font-semibold text-accent-fg hover:opacity-90">
              Shuru karo →
            </Link>
          )}
          <Link href="/playground/" className="rounded-lg border border-line px-5 py-3 font-semibold hover:border-accent">
            Animations dekho
          </Link>
        </div>
        <div className="mt-6 max-w-md">
          <ContinueCard titles={titles} />
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-bold">Is site ko kaise use karein</h2>
        <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.t} className="rounded-xl border border-line p-4">
              <div className="font-mono text-sm text-accent">0{i + 1}</div>
              <div className="mt-1 font-bold">{s.t}</div>
              <p className="mt-1 text-sm text-muted">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="mb-1 text-xl font-bold">Roadmap</h2>
        <p className="mb-4 text-sm text-muted">Isi order mein padhna best hai — har chapter pichle wale par build karta hai.</p>
        <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {nav.map((c) => (
            <li key={c.id}>
              <Link href={c.href} className="flex h-full flex-col gap-2 rounded-xl border border-line p-4 hover:border-accent">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-sm text-accent">{String(c.index).padStart(2, '0')}</span>
                  <span className="font-bold">{c.title}</span>
                </div>
                <p className="flex-1 text-sm text-muted">{c.subtitle}</p>
                <ChapterProgress ids={c.topics.map((t) => t.id)} />
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
