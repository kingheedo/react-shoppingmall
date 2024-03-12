/* eslint-disable func-style */
import axios from 'axios';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
 
export async function middleware(request: NextRequest) {
  const cookie = request.cookies.get('rnbck')?.value;
  axios.defaults.headers.Cookie = '';
  if (cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  
  const response = NextResponse.next();

  return response;
}