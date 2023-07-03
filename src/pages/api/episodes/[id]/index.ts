import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { episodeValidationSchema } from 'validationSchema/episodes';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.episode
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getEpisodeById();
    case 'PUT':
      return updateEpisodeById();
    case 'DELETE':
      return deleteEpisodeById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getEpisodeById() {
    const data = await prisma.episode.findFirst(convertQueryToPrismaUtil(req.query, 'episode'));
    return res.status(200).json(data);
  }

  async function updateEpisodeById() {
    await episodeValidationSchema.validate(req.body);
    const data = await prisma.episode.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteEpisodeById() {
    const data = await prisma.episode.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
