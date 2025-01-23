// pages/api/activities.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const activities = await prisma.activity.findMany({
        include: {
          user: true,
        },
      });
      res.status(200).json(activities);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch activities' });
    }
  } else if (req.method === 'POST') {
    try {
      const activity = await prisma.activity.create({
        data: req.body,
      });
      res.status(201).json(activity);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create activity' });
    }
  }
}