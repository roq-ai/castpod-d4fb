import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { playlistValidationSchema } from 'validationSchema/playlists';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.playlist
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getPlaylistById();
    case 'PUT':
      return updatePlaylistById();
    case 'DELETE':
      return deletePlaylistById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPlaylistById() {
    const data = await prisma.playlist.findFirst(convertQueryToPrismaUtil(req.query, 'playlist'));
    return res.status(200).json(data);
  }

  async function updatePlaylistById() {
    await playlistValidationSchema.validate(req.body);
    const data = await prisma.playlist.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deletePlaylistById() {
    const data = await prisma.playlist.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
