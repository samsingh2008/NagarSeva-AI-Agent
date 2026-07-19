export const errorHandler = (err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
};
//# sourceMappingURL=errorHandler.js.map