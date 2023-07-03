import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { episodeValidationSchema } from 'validationSchema/episodes';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getEpisodes();
    case 'POST':
      return createEpisode();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getEpisodes() {
    const data = await prisma.episode
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'episode'));
    return res.status(200).json(data);
  }

  async function createEpisode() {
    await episodeValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.snippet?.length > 0) {
      const create_snippet = body.snippet;
      body.snippet = {
        create: create_snippet,
      };
    } else {
      delete body.snippet;
    }
    const data = await prisma.episode.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
