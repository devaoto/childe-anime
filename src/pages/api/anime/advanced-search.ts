import { META } from '@consumet/extensions';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

const ani = new META.Anilist();

const allowedGenres = [
  'Action',
  'Adventure',
  'Cars',
  'Comedy',
  'Drama',
  'Fantasy',
  'Horror',
  'Mahou Shoujo',
  'Mecha',
  'Music',
  'Mystery',
  'Psychological',
  'Romance',
  'Sci-Fi',
  'Slice of Life',
  'Sports',
  'Supernatural',
  'Thriller',
];

const performSearch: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method === 'POST') {
    try {
      const {
        query,
        page,
        perPage,
        type,
        genres,
        sort,
        season,
        year,
        id,
        format,
        status,
      } = req.query;

      const getParamValue = (
        param: string | string[] | undefined
      ): string | string[] | undefined => {
        return Array.isArray(param)
          ? param
          : param !== undefined
          ? param
          : undefined;
      };

      let genreArray: string[] | undefined = getParamValue(genres)
        ?.toString()
        .split(', ')
        .filter((genre) => allowedGenres.includes(genre));
      console.log(genreArray);

      let typeC = getParamValue(type)?.toString().toUpperCase();

      if (Number.isNaN(page) || Number.isNaN(perPage)) {
        return res.status(400).json({
          message:
            'Required number for the parameters which requires a number.',
        });
      }
      const results = await ani.advancedSearch(
        getParamValue(query) as string | undefined,
        typeC,
        Number(page),
        Number(perPage),
        getParamValue(format) as string | undefined,
        getParamValue(sort) as string[] | undefined,
        genreArray,
        getParamValue(id) as string | undefined,
        Number(year) as number | undefined,
        getParamValue(status) as string | undefined,
        getParamValue(season) as string | undefined
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
