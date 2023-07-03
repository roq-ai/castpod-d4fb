import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { podcastValidationSchema } from 'validationSchema/podcasts';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.podcast
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getPodcastById();
    case 'PUT':
      return updatePodcastById();
    case 'DELETE':
      return deletePodcastById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPodcastById() {
    const data = await prisma.podcast.findFirst(convertQueryToPrismaUtil(req.query, 'podcast'));
    return res.status(200).json(data);
  }

  async function updatePodcastById() {
    await podcastValidationSchema.validate(req.body);
    const data = await prisma.podcast.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deletePodcastById() {
    const data = await prisma.podcast.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
