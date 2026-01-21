import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      
      return NextResponse.json({
        success: true,
        data: {
          token,
        },
      });
    }
    
    // If no token found, return 401
    return NextResponse.json(
      { success: false, error: { message: 'No authentication token found' } },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { message: 'Failed to get token' } },
      { status: 500 }
    );
  }
}