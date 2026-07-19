import { apiUrl } from '@/lib/api';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const backendUrl = apiUrl('/complaints');

    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      body: formData,
    });

    const data = await backendResponse.json().catch(() => ({}));

    if (!backendResponse.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to submit complaint' },
        { status: backendResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: data.data,
      message: data.message || 'Complaint created successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to submit complaint',
      },
      { status: 500 }
    );
  }
}
