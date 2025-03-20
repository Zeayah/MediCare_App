const asyncWrapper = (fn) => {
    return async (requestAnimationFrame, res, next) => {
        try{
            await fn(requestAnimationFrame, res, next);
        } catch (error) {
            next(error);
        }
    };
};

export default asyncWrapper;