import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <p className="font-mono text-6xl font-bold text-accent">404</p>
      <h1 className="mt-4 text-2xl font-bold">Ye page nahi mila</h1>
      <p className="mt-2 text-muted">Shayad link galat hai, ya ye topic abhi likha ja raha hai.</p>
      <Link href="/" className="mt-6 inline-block rounded-lg bg-accent px-5 py-2.5 font-semibold text-accent-fg">
        Home par chalo
      </Link>
    </div>
  );
}
