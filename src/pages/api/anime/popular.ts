import { META } from '@consumet/extensions';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

const ani = new META.Anilist();

const getPopular: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const results = await ani.fetchPopularAnime(1, 20);

    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal Server Error',
      hint: (error as Error).message,
    });
  }
};

export default getPopular;
