const { KnownError } = require("../controllers/errors");

module.exports = function(...requiredFields){
    return async function(req, _, next){
        const errors = [];
        const reqBodyClone = Object.create(null);
        const { default: validators } = await import("../../shared/validators.mjs");
        const reqBodyKeys = [ ...new Set(requiredFields.concat(Object.keys(req.body))) ];
        
        await Promise.all(reqBodyKeys.map(async (field)=>{
            const validatorFn = validators[field];
            if(validatorFn){
                try{
                    reqBodyClone[field] = await validatorFn.call(validators, req.body[field], req.body);
                }catch(err){
                    errors.push(err.message);
                }
            }else{
                reqBodyClone[field] = req.body[field];
            }
        }))

        if(errors.length > 0) return next(new KnownError(errors.join("\n"), 400));
        req.body = reqBodyClone;
        next();
    }
}