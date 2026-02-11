/**
 * 关于我页面 - 技能专长区域
 */
import type { AboutSkillGroup } from '../types';

interface AboutSkillsProps {
  skills: AboutSkillGroup[] | null;
}

export default function AboutSkills({ skills }: AboutSkillsProps) {
  if (!skills || skills.length === 0) return null;

  return (
    <section className="rounded-xl bg-off-white p-8 shadow-natural dark:bg-background-dark/50 md:p-12">
      <h2 className="mb-8 text-center text-3xl font-bold text-wood-dark dark:text-text-dark">
        技能与专长
      </h2>
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((group) => (
          <div key={group.category} className="space-y-6">
            <h3 className="text-xl font-semibold text-text-light dark:text-text-dark/90">
              {group.category}
            </h3>
            <div className="space-y-4">
              {group.items.map((item) => (
                <div
                  key={item.name}
                  className="transition-transform duration-300 hover:-translate-y-1"
                >
                  <p className="font-medium">{item.name}</p>
                  <div className="mt-1 h-2 rounded-full bg-primary/20 dark:bg-primary/30">
                    <div
                      className="h-2 rounded-full bg-primary dark:bg-primary/70"
                      style={{ width: `${item.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
