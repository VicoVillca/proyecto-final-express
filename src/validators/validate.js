function validate(schema, target = 'body'){
    return (req, res, next) => {
        const data = req[target];

        if(!data || Object.keys(data).length === 0){
            return res.status(400).json({
                messaje: `El ${target} no puede estar vacío`})
        }

        const {error, value} = schema.validate(data, {
            abortEarly: false,
            stripUnknown: true
        });

        if(error) {
            return res.status(400).json({
                message: 'Error de validación',
                details: error.details.map(detail => detail.message)
            })
        }

        req[target] = value;
        next();
    }
}

export default validate;