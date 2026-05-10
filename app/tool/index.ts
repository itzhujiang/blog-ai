import { Tool } from '@ag-ui/client';
import { zodToJsonSchema } from 'zod-to-json-schema';

import { ToolType } from '../utils/types';

import { authorization } from './Authorization';
import { weatherCard } from './WeatherCard';


/**
 * 创建工具数组，用户传入工具类型数组，返回符合AG-UI要求的工具数组
 * @param tools
 * @returns
 */
export const createTools = (tools: ToolType[]): Tool[] => {
  return tools.map(tool => {
    const { name, description, parameters } = tool;
    let jsonSchema = {};
    if (parameters) {
      jsonSchema = zodToJsonSchema(parameters!, name);
    }
    return {
      name,
      description,
      parameters: jsonSchema,
    };
  });
}; 

export const toolsArr = [authorization, weatherCard];
