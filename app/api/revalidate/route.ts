/**
 * On-Demand Revalidation API
 * POST /api/revalidate — 主动刷新 ISR 缓存
 *
 * Body: { secret: string, paths: string[] }
 * - secret 必须与环境变量 REVALIDATION_SECRET 一致
 * - paths 为需要刷新的路径数组，每项以 / 开头，最多 20 个
 */

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

const MAX_PATHS = 20;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, paths } = body;

    // 验证密钥
    const expectedSecret = process.env.REVALIDATION_SECRET;
    if (!expectedSecret || secret !== expectedSecret) {
      return NextResponse.json(
        { error: '无效的密钥' },
        { status: 401 },
      );
    }

    // 校验 paths 参数
    if (!Array.isArray(paths) || paths.length === 0) {
      return NextResponse.json(
        { error: 'paths 必须为非空数组' },
        { status: 400 },
      );
    }

    if (paths.length > MAX_PATHS) {
      return NextResponse.json(
        { error: `paths 最多 ${MAX_PATHS} 个` },
        { status: 400 },
      );
    }

    // 校验每个路径格式
    const invalidPaths = paths.filter(
      (p: unknown) => typeof p !== 'string' || !p.startsWith('/'),
    );
    if (invalidPaths.length > 0) {
      return NextResponse.json(
        { error: '每个路径必须为以 / 开头的字符串', invalidPaths },
        { status: 400 },
      );
    }

    // 执行 revalidation
    for (const path of paths as string[]) {
      revalidatePath(path);
    }

    return NextResponse.json({
      revalidated: true,
      paths,
    });
  } catch (error) {
    console.error('Revalidation 失败:', error);
    return NextResponse.json(
      { error: 'Revalidation 失败' },
      { status: 500 },
    );
  }
}
