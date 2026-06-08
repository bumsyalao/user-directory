import { Router, Request, Response, NextFunction } from "express";
import { getUsers, parseUserQuery } from "../services/users.service";

const router = Router();

/**
 * GET /api/users
 * Returns paginated users, pagination metadata, and top-20 facet counts
 * for the active search, filter, and sort state.
 */
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = parseUserQuery(req.query as Record<string, unknown>);
    const result = getUsers(query);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
