import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { individualValidationSchema } from 'validationSchema/individuals';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getIndividuals();
    case 'POST':
      return createIndividual();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getIndividuals() {
    const data = await prisma.individual
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'individual'));
    return res.status(200).json(data);
  }

  async function createIndividual() {
    await individualValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.episode?.length > 0) {
      const create_episode = body.episode;
      body.episode = {
        create: create_episode,
      };
    } else {
      delete body.episode;
    }
    if (body?.playlist?.length > 0) {
      const create_playlist = body.playlist;
      body.playlist = {
        create: create_playlist,
      };
    } else {
      delete body.playlist;
    }
    if (body?.podcast?.length > 0) {
      const create_podcast = body.podcast;
      body.podcast = {
        create: create_podcast,
      };
    } else {
      delete body.podcast;
    }
    if (body?.snippet?.length > 0) {
      const create_snippet = body.snippet;
      body.snippet = {
        create: create_snippet,
      };
    } else {
      delete body.snippet;
    }
    const data = await prisma.individual.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
