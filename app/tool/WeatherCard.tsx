import { z } from 'zod/v3';

import { toolResult } from '@/requests';
import { ToolType } from '@/utils/types';


// 根据天气现象返回对应的 Material Symbol 图标名
const getWeatherIcon = (weather: string): string => {
  if (weather.includes('晴')) return 'sunny';
  if (weather.includes('多云')) return 'partly_cloudy_day';
  if (weather.includes('阴')) return 'cloud';
  if (weather.includes('雷')) return 'thunderstorm';
  if (weather.includes('雪')) return 'weather_snowy';
  if (weather.includes('雨')) return 'rainy';
  if (weather.includes('雾') || weather.includes('霾')) return 'foggy';
  if (weather.includes('风')) return 'air';
  return 'partly_cloudy_day';
};

/**
 * 天气卡片，用于展示对应的天气
 */
export const weatherCard: ToolType<{ city: string, weather: string, temperature: string, windDirection: string, windPower: string }> = {
  name: 'weatherCard',
  description: '天气卡片，用于展示天气',
  type: 'tsx',
  renderingPos: 'chat',
  parameters: z.object({
    city: z.string().describe('城市名称'),
    weather: z.string().describe('天气现象'),
    temperature: z.string().describe('温度，单位：摄氏度'),
    windDirection: z.string().describe('风向'),
    windPower: z.string().describe('风力等级')
  }),
  run: ({ city, weather, temperature, windDirection, windPower }, toolId) => {
    toolResult({
      toolId,
      toolResult: '成功'
    });
    return (
      <div className="my-1 w-64 rounded-2xl border border-primary/20 bg-background-light dark:bg-background-dark shadow-natural overflow-hidden">
        {/* 顶部城市 + 天气 */}
        <div className="flex items-center justify-between bg-primary/10 dark:bg-primary/15 px-4 py-3">
          <div className="flex items-center gap-1.5 text-text-light dark:text-text-dark">
            <span className="material-symbols-outlined text-[16px]">location_on</span>
            <span className="text-sm font-semibold">{city}</span>
          </div>
          <span className="text-xs text-text-light/60 dark:text-text-dark/50">{weather}</span>
        </div>

        {/* 温度 + 图标 */}
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <div className="text-4xl font-bold text-text-light dark:text-primary/90">
              {temperature}
              <span className="text-xl font-normal">°C</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[52px] text-primary/80 dark:text-primary/70" style={{ fontVariationSettings: "'FILL' 1" }}>
            {getWeatherIcon(weather)}
          </span>
        </div>

        {/* 底部风向风力 */}
        <div className="flex items-center gap-1.5 border-t border-primary/10 px-4 py-2.5 text-xs text-text-light/70 dark:text-text-dark/50">
          <span className="material-symbols-outlined text-[14px]">air</span>
          <span>{windDirection} {windPower}级</span>
        </div>
      </div>
    );
  }
};
