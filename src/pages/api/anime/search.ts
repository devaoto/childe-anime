import { META } from '@consumet/extensions';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

const ani = new META.Anilist();

const performSearch: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === 'POST') {
    try {
      let page: string | string[] | number | undefined;
      let perPage: string | string[] | number | undefined;
      const { query } = req.query;
      page = req.query.page;
      perPage = req.query.perPage;
      if (!page) {
        page = 1;
      }
      if (!perPage) {
        perPage = 20;
      }
      if (Number.isNaN(page) || Number.isNaN(perPage)) {
        return res.status(400).json({
          message:
            'Required number for the parameters which requires a number.',
        });
      }
      const results = await ani.search(
        query as string,
        Number(page),
        Number(perPage)
      );

      res.status(200).json(results);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: 'Internal Server Error',
        hint: (error as Error).message,
      });
    }
  } else {
    return res.status(500).json({
      message: `Method ${req.method} is not allowed for this route.`,
      allowedMethod: 'POST',
    });
  }
};

export default performSearch;
