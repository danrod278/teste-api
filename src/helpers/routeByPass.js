module.exports = (func, ...excludeRoutes) => {
    return (req, res, next) => {
        for (let route of excludeRoutes) {
            if (req.path === route) {
                return next();
            }
        }
        return func(req, res, next)
    }
}