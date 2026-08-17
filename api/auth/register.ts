import handler from "../[...route].js";
export default function route(req: any, res: any) { req.query = { ...req.query, route: ["auth", "register"] }; return handler(req, res); }
