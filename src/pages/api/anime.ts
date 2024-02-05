import { META } from '@consumet/extensions';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

const ani = new META.Anilist();

const getRoutes: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    res.status(200).json({
      availableRoutes: [
        {
          path: '/trending',
          description: 'Get list of trending Anime',
        },
        {
          path: '/popular',
          description: 'Get all time popular Anime',
        },
      ],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal Server Error',
      hint: (error as Error).message,
    });
  }
};

export default getRoutes;
