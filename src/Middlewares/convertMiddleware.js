const convertTypesMiddleware = (req, res, next) => {
    console.log("Antes da conversão:", req.body);
  
    for (const key in req.body) {
      if (req.body[key] === "true") req.body[key] = true;
      if (req.body[key] === "false") req.body[key] = false;
    }
  
    console.log("Depois da conversão:", req.body);
    next();
  };
  
  export default convertTypesMiddleware;