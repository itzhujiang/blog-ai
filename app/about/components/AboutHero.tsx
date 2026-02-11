/**
 * 关于我页面 - 标题区域
 */
export default function AboutHero() {
  return (
    <section className="text-center">
      <h1 className="text-4xl font-extrabold tracking-tight text-wood-dark dark:text-text-dark sm:text-5xl">
        关于我
      </h1>
      <p className="mt-4 text-lg text-text-light/80 dark:text-text-dark/80">
        认识一下，这是我的数字家园
      </p>
      <div className="mx-auto mt-6 h-px w-20 bg-wood-border/50" />
    </section>
  );
}
