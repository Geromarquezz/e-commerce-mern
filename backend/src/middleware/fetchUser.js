import jwt from 'jsonwebtoken';

export async function fetchUser (req, res, next) {
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ errors: "Please authenticate using valid token" })
    }
    else {
        try {
            const data = jwt.verify(token, 'secret_ecom');
            req.user = data.user
            next();
        } catch (error) {
            res.status(401).send({ errors: "Please authenticate using a valid token" })
        }
    }
}

export default fetchUser;
