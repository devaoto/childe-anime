import { ANIME, META } from '@consumet/extensions';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

const ani = new META.Anilist(new ANIME.Zoro());

const getDetails: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const id = req.headers['x-anilist-id'] || req.query.id;

    const info = await ani.fetchAnimeInfo(id as string);

    res.status(200).json(info);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal Server Error',
      hint: (error as Error).message,
    });
  }
};

export default getDetails;
