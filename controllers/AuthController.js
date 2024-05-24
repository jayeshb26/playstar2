
const authenticateToken = require('../middleware/authMiddleware');

const AuthController = {
    authTokenHit: async (req, res) => {
        try {
               const requestData = req.body;


               const response = {
                   Message: null,
                   Status: true,
                   ID: 0
               };

               res.json(response);

        } catch (error) {
            console.log('============[Error]=================');
            console.error(error);
            console.log('============[Error]=================');

            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

module.exports = AuthController;
