import Link from "next/link";

export function Logo() {
  return (
    <Link className="brand" href="/" aria-label="OASFuse home">
      <svg className="brand-mark" viewBox="0 0 32 38" aria-hidden="true">
        <path
          d="M16 1 29 8v11c0 8-5 14-13 18C8 33 3 27 3 19V8L16 1Z"
          fill="var(--orange)"
        />
        <path d="m17 7-7 10 5 1-2 11 9-14-5-1V7Z" fill="var(--canvas)" />
      </svg>
      <span>OASFuse</span>
    </Link>
  );
}
