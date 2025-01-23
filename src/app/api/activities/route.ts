
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
      if (!prisma) {
        throw new Error('Prisma client not initialized');
      }
      const activities = await prisma.activity.findMany().catch((err:any) => {
        console.error('Prisma query error:', err);
        throw err;
      });
  
      console.log('Fetched activities:', activities);
  
      return NextResponse.json(activities);
    } catch (error) {
      console.error('Complete error details:', error);
      
      return NextResponse.json(
        { 
          error: 'Failed to fetch activities', 
          details: error instanceof Error ? error.message : String(error)
        }, 
        { status: 500 }
      );
    }
  }

  export async function POST(request: Request) {
    try {
      const { suggestion, location } = await request.json();
      const activities = await prisma.activity.findMany({
        where: {
          category: {
            in: suggestion.categories
          }
        }
      });
  
      return NextResponse.json(activities);
    } catch (error) {
      console.error('Error generating activities:', error);
      return NextResponse.json(
        { error: 'Failed to generate activities' }, 
        { status: 500 }
      );
    }
  }