/**
 * 验证码工具模块
 * 使用 svg-captcha 生成数学表达式验证码
 * 使用 HMAC-SHA256 签名实现无状态 Token 验证
 */

import crypto from 'crypto';

import svgCaptcha from 'svg-captcha';

const CAPTCHA_EXPIRE_MS = 5 * 60 * 1000; // 5 分钟

function getSecret(): string {
  const secret = process.env.CAPTCHA_SECRET || process.env.REVALIDATION_SECRET;
  if (!secret) {
    throw new Error('CAPTCHA_SECRET 或 REVALIDATION_SECRET 环境变量未配置');
  }
  return secret;
}

function hmacSign(payload: string): string {
  return crypto
    .createHmac('sha256', getSecret())
    .update(payload)
    .digest('hex');
}

export interface CaptchaResult {
  svg: string;
  token: string;
}

/**
 * 生成数学验证码
 * 返回 SVG 图片和签名 Token
 */
export function generateCaptcha(): CaptchaResult {
  const captcha = svgCaptcha.createMathExpr({
    mathMin: 1,
    mathMax: 20,
    mathOperator: '+-',
    noise: 2,
    color: true,
    width: 150,
    height: 40,
  });

  const answer = String(captcha.text);
  const expiresAt = Date.now() + CAPTCHA_EXPIRE_MS;
  const payload = Buffer.from(`${answer}|${expiresAt}`).toString('base64url');
  const signature = hmacSign(payload);
  const token = `${payload}.${signature}`;

  return { svg: captcha.data, token };
}

export interface VerifyResult {
  valid: boolean;
  error?: string;
}

/**
 * 验证验证码 Token 和用户答案
 * 使用 timingSafeEqual 防止时序攻击
 */
export function verifyCaptcha(token: string, userAnswer: string): VerifyResult {
  if (!token || !userAnswer) {
    return { valid: false, error: '请完成验证码' };
  }

  const dotIndex = token.lastIndexOf('.');
  if (dotIndex === -1) {
    return { valid: false, error: '验证码 Token 格式无效' };
  }

  const payload = token.slice(0, dotIndex);
  const signature = token.slice(dotIndex + 1);

  // 验证签名
  const expectedSig = hmacSign(payload);
  const sigBuf = Buffer.from(signature, 'hex');
  const expectedBuf = Buffer.from(expectedSig, 'hex');

  if (sigBuf.length !== expectedBuf.length
    || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return { valid: false, error: '验证码 Token 签名无效' };
  }

  // 解码 payload
  let decoded: string;
  try {
    decoded = Buffer.from(payload, 'base64url').toString('utf-8');
  } catch {
    return { valid: false, error: '验证码 Token 解码失败' };
  }

  const [answer, expiresAtStr] = decoded.split('|');
  const expiresAt = parseInt(expiresAtStr, 10);

  if (isNaN(expiresAt) || Date.now() > expiresAt) {
    return { valid: false, error: '验证码已过期，请刷新重试' };
  }

  if (String(userAnswer).trim() !== answer) {
    return { valid: false, error: '验证码答案错误' };
  }

  return { valid: true };
}
