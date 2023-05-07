const notFound = (req,res,next) =>{
    const error = new Error(`Not Found - ${req.originalURL}`);
    res.status(404).json({error:'404 Not Found'});
    next(error);
}

module.exports = {notFound};