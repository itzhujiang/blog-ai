// a2ui渲染器
import Image from 'next/image';
import React from 'react';

import { A2UI, A2UIComponent } from '@/utils/types';


function buildComponentMap(components: A2UIComponent[]): Record<string, A2UIComponent> {
  return components.reduce((map: Record<string, A2UIComponent>, comp: A2UIComponent) => {
    map[comp.id] = comp;
    return map;
  }, {});
}

export function A2UIRenderer({ value }: { value: A2UI[] }) {
  console.log('A2UIRenderer value:', value);
  if (!Array.isArray(value)) return null;
  const updateMsg = value.find(msg => 'updateComponents' in msg) as
    | { updateComponents: { components: A2UIComponent[] } }
    | undefined;

  if (!updateMsg) return null;

  const componentMap = buildComponentMap(updateMsg.updateComponents.components);

  return (
    <div className="rounded-xl border border-primary/20 bg-background-light p-4 shadow-natural dark:bg-background-dark">
      {renderNode('root', componentMap)}
    </div>
  );
}


const TEXT_VARIANT_CLASSES: Record<string, string> = {
  heading: 'text-lg font-semibold text-foreground',
  subheading: 'text-base font-medium text-foreground',
  caption: 'text-xs text-text-light dark:text-text-dark',
  label: 'text-sm font-medium text-primary',
  body: 'text-sm text-foreground',
};

function renderNode(id: string, componentMap: Record<string, A2UIComponent>): React.ReactNode {
  const node = componentMap[id];
  if (!node) return null;
  switch (node.component) {
    case 'Column':
      return (
        <div key={id} className="flex flex-col gap-3">
          {node.children?.map(childId => renderNode(childId, componentMap))}
        </div>
      );

    case 'Row':
      return (
        <div key={id} className="flex flex-wrap items-center gap-3">
          {node.children?.map(childId => renderNode(childId, componentMap))}
        </div>
      );

    case 'Text': {
      const variantClass = (node.variant && TEXT_VARIANT_CLASSES[node.variant])
        || TEXT_VARIANT_CLASSES.body;
      return (
        <span key={id} className={variantClass}>
          {node.text}
        </span>
      );
    }

    case 'Image': {
      const src = node.src.replace(/^https?:\/\/[^/]+/, '');
      return (
        <div key={id} className="relative overflow-hidden rounded-lg border border-primary/15 shadow-natural">
          <Image
            src={src}
            alt={node.alt || ''}
            width={400}
            height={300}
            className="h-auto w-full object-cover"
          />
        </div>
      );
    }

    default:
      return null;
  }
}
