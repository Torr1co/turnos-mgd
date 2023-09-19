import React from "react";

export default function StickyLayout({
  children,
}: {
  children: [React.ReactNode, React.ReactNode];
}) {
  return (
    <div className="-mx-20 -mb-16 grid min-h-screen  border-primary md:grid-cols-5">
      <section className="p-8 px-20 md:col-span-3">{children[0]}</section>
      <section className="w-full border-l border-t border-primary md:col-span-2">
        <div className="sticky top-24 flex flex-col gap-6 p-8 px-20 sm:px-8">
          {children[1]}
        </div>
      </section>
    </div>
  );
}
