import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { snippetValidationSchema } from 'validationSchema/snippets';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.snippet
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getSnippetById();
    case 'PUT':
      return updateSnippetById();
    case 'DELETE':
      return deleteSnippetById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getSnippetById() {
    const data = await prisma.snippet.findFirst(convertQueryToPrismaUtil(req.query, 'snippet'));
    return res.status(200).json(data);
  }

  async function updateSnippetById() {
    await snippetValidationSchema.validate(req.body);
    const data = await prisma.snippet.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteSnippetById() {
    const data = await prisma.snippet.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
