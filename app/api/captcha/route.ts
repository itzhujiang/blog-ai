/**
 * 验证码 API
 * GET /api/captcha — 生成数学验证码 SVG 和 Token
 */

import { NextResponse } from 'next/server';

import { generateCaptcha } from '@/utils/captcha';

export async function GET() {
  try {
    const { svg, token } = generateCaptcha();

    return NextResponse.json(
      { svg, token },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    console.error('生成验证码失败:', error);
    return NextResponse.json(
      { error: '生成验证码失败' },
      { status: 500 },
    );
  }
}
