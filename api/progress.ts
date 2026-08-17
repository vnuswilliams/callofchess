import handler from "./[...route].js";
export default function route(req: any, res: any) { req.query = { ...req.query, route: ["progress"] }; return handler(req, res); }
