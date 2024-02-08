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

const getParamValue = (
  param: string | string[] | undefined
): string | string[] | undefined => {
  if (Array.isArray(param) || param !== undefined) {
    return param;
  }
  return undefined;
};

const validatePageAndPerPage = (
  page: string,
  perPage: string,
  res: NextApiResponse
) => {
  const pageValue = Number(page);
  const perPageValue = Number(perPage);

  if (Number.isNaN(pageValue) || Number.isNaN(perPageValue)) {
    return res.status(400).json({
      message: 'Page and perPage parameters must be numbers.',
    });
  }
};

const parseGenres = (rawGenres: string | undefined): string[] | undefined => {
  if (!rawGenres) {
    return undefined;
  }

  const trimmedGenres = rawGenres.trim();
  return trimmedGenres
    .split(',')
    .map((genre) => genre.trim())
    .filter((genre) => allowedGenres.includes(genre));
};

const performSearch: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({
      message: `Method ${req.method} is not allowed for this route.`,
      allowedMethods: ['POST', 'GET'],
    });
  }

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

    validatePageAndPerPage(page as string, perPage as string, res);

    const genreArray = parseGenres(getParamValue(genres)?.toString());

    const q = query === 'null' ? undefined : getParamValue(query);

    const results = await ani.advancedSearch(
      q as string | undefined,
      type?.toString().toUpperCase(),
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
      hint: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export default performSearch;
